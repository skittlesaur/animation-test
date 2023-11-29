'use client'
import { motion, useAnimate } from 'framer-motion'
import { useEffect, useState } from 'react'

let boxAnimation: any
let cursorAnimation: any

const Page = () => {
  const [box, animateBox] = useAnimate()
  const [cursor, animateCursor] = useAnimate()
  const [mouseEnter, setMouseEnter] = useState(false)

  useEffect(() => {
    boxAnimation = animateBox(
      box.current,
      {
        x: -100,
        y: [0, 100, -150, -150],
        rotate: [0, 0, -5, -5],
      },
      {
        duration: 5,
        repeat: Infinity,
        repeatType: 'reverse',
      }
    )

    cursorAnimation = animateCursor(
      cursor.current,
      {
        x: [800, 800, 800, 400, 400],
        y: [100, 110, 100, 80],
      },
      {
        duration: 5,
        repeat: Infinity,
        repeatType: 'reverse',
      }
    )
  }, [])

  useEffect(() => {
    if (mouseEnter) {
      boxAnimation?.pause()
      cursorAnimation?.pause()
      animateCursor(
        cursor.current,
        {
          scale: 0,
        },
        {
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }
      )
    } else {
      boxAnimation?.play()
      cursorAnimation?.play()
      animateCursor(
        cursor.current,
        {
          scale: 1,
        },
        {
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }
      )
    }
  }, [mouseEnter])

  useEffect(() => {
    let isPointer = false
    const handleMouseAnimationChange = () => {
      const { left } = cursor.current.getBoundingClientRect()

      if (left > 740 && left < 790 && !isPointer) {
        isPointer = true
        cursor.current.src = '/cursor_pointer.png'
      } else if (isPointer && left >= 790) {
        isPointer = false
        cursor.current.src = '/cursor_default.png'
      }
    }

    const observer = new MutationObserver(handleMouseAnimationChange)

    observer.observe(cursor.current, {
      attributes: true,
      attributeFilter: ['style'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-orange-200">
      <div
        onMouseEnter={() => setMouseEnter(true)}
        onMouseLeave={() => setMouseEnter(false)}
        className="relative w-[800px] h-[500px] bg-white flex flex-col rounded-xl overflow-hidden border border-orange-300">
        <motion.img
          ref={cursor}
          className="z-10 absolute origin-center w-6 h-6 object-contain"
          src="/cursor_default.png"
        />
        <motion.div
          ref={box}
          className="right-0 bottom-0 absolute bg-purple-400 w-[30rem] h-[20rem] p-4">
          <input
            className="w-full h-20 bg-transparent text-xl"
            defaultValue="Awwwards winning animation"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Page
