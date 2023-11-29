'use client'
import { motion, useAnimate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'

let boxAnimation: any
let cursorAnimation: any

const texts = ['Awwwards winning animation', 'baraaa>>>', 'Hello there']

const Page = () => {
  const [box, animateBox] = useAnimate()
  const [cursor, animateCursor] = useAnimate()
  const [mouseEnter, setMouseEnter] = useState(false)
  const [input, setInput] = useState(texts[0])
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    let typingIndex = 1
    let lastTime = 0
    let cleared = false
    let completed = false

    boxAnimation = animateBox(
      box.current,
      {
        x: [0, -100, -100, -100, -100],
        y: [0, 100, -150, -150, -150, -150, -150],
        rotate: [0, 0, -5, -5, -5, -5, -5, -5],
      },
      {
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
      }
    )

    cursorAnimation = animateCursor(
      cursor.current,
      {
        x: [800, 800, 800, 400, 400, 400, 400],
        y: [140, 110, 100, 100, 80, 80, 80, 80],
      },
      {
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
        onUpdate: () => {
          const time = cursorAnimation.time % (cursorAnimation.duration * 2)
          if (time === lastTime) return
          lastTime = time

          const isTyping = time > 5 && time < 10

          if (isTyping) {
            cursor.current.src = '/cursor_typing.png'
            setIsFocused(true)

            if (!cleared) {
              cleared = true
              inputRef.current?.focus()
              setTimeout(() => {
                // select input text
                inputRef.current?.setSelectionRange(0, input.length)

                setTimeout(() => {
                  setInput('')
                  inputRef.current?.blur()
                }, 300)
              }, 200)
            }

            if (time > 5.5 && time <= 8 && !completed) {
              //  typing animation
              const text = texts[typingIndex]
              // get the char index. 5.5 is 0, and 8 is text.length
              const charIndex = ((time - 5.5) / (8 - 5.5)) * text.length
              const lastCharIndex = Math.ceil(charIndex)

              const textBefore = text.slice(
                0,
                lastCharIndex > text.length ? text.length : lastCharIndex
              )

              setInput(textBefore)

              if (textBefore === text) {
                completed = true
              }
            }

            return
          } else {
            setIsFocused(false)
            cleared = false
          }

          if (completed) {
            completed = false
            typingIndex = (typingIndex + 1) % texts.length
          }

          const isPointer = time > 3.7 && time < 12.4

          if (isPointer) {
            cursor.current.src = '/cursor_pointer.png'
          } else {
            cursor.current.src = '/cursor_default.png'
          }
        },
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
          <div className="relative w-full h-fit">
            <input
              ref={inputRef}
              className={cn(
                'w-full h-20 bg-transparent text-xl border-2 p-2 focus:border-white rounded-lg outline-0',
                {
                  'border-transparent': !isFocused,
                  'border-white': isFocused,
                }
              )}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Page
