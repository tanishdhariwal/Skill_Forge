"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send } from "lucide-react"
import { cn } from "../lib/utils"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  isTyping?: boolean
}

export function AiTutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm your AI tutor. How can I help you with React today?",
      sender: "ai",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: getAiResponse(input),
        sender: "ai",
        isTyping: true,
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000)
  }

  const getAiResponse = (question: string): string => {
    const responses = [
      "React hooks are functions that let you 'hook into' React state and lifecycle features from function components.",
      "The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.",
      "The useState hook lets you add React state to function components. It returns a stateful value and a function to update it.",
      "Custom hooks are a mechanism to reuse stateful logic between components. They follow the use* naming convention and can call other hooks.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">AI Tutor</h1>
        <p className="text-gray-400">Ask questions about React and get instant answers</p>
      </div>

      <div className="flex-1 rounded-xl bg-gray-800/50 border border-gray-700 p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100",
                  )}
                >
                  {message.isTyping ? <TypewriterText text={message.text} /> : <p>{message.text}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-gray-700 px-4 py-2 text-gray-100">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                    className="h-2 w-2 rounded-full bg-gray-400"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                      delay: 0.2,
                    }}
                    className="h-2 w-2 rounded-full bg-gray-400"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                      delay: 0.4,
                    }}
                    className="h-2 w-2 rounded-full bg-gray-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <motion.input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about React hooks, components, state..."
            className="flex-1 rounded-full bg-gray-700 px-4 py-2 text-white placeholder-gray-400 outline-none ring-blue-500 focus:ring-2"
            whileFocus={{ scale: 1.01 }}
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              input.trim() ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-gray-700 text-gray-400",
            )}
            whileHover={input.trim() ? { scale: 1.1 } : {}}
            whileTap={input.trim() ? { scale: 0.9 } : {}}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 30)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return <p>{displayedText}</p>
}

