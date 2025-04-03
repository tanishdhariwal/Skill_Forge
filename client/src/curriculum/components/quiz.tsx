"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const questions = [
    {
      question: "Which hook is used for side effects in React?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: 1,
    },
    {
      question: "What does the useCallback hook do?",
      options: [
        "Creates a memoized callback function",
        "Manages component state",
        "Provides context values",
        "Handles form submission",
      ],
      correctAnswer: 0,
    },
  ]

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Quiz: React Hooks</h1>
        <p className="text-gray-400">Test your knowledge of React hooks</p>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 10 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gray-800/50 p-6 border border-gray-700 h-full"
          >
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <h2 className="mt-2 text-xl font-semibold text-white">{questions[currentQuestion].question}</h2>
            </div>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={cn(
                    "relative flex w-full items-center rounded-lg border p-4 text-left transition-all",
                    selectedAnswer === index
                      ? "border-green-500 bg-green-500/10 text-white"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50",
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
                    {selectedAnswer === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-3 w-3 rounded-full bg-green-500"
                      />
                    )}
                  </div>
                  <span>{option}</span>
                  {selectedAnswer === index && <Check className="ml-auto h-5 w-5 text-green-500" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-between">
        <motion.button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={cn(
            "flex items-center rounded-lg px-4 py-2 font-medium",
            currentQuestion === 0 ? "cursor-not-allowed text-gray-500" : "bg-gray-800 text-white hover:bg-gray-700",
          )}
          whileHover={currentQuestion !== 0 ? { x: -4 } : {}}
          whileTap={currentQuestion !== 0 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </motion.button>
        <motion.button
          onClick={handleNext}
          disabled={currentQuestion === questions.length - 1}
          className={cn(
            "flex items-center rounded-lg px-4 py-2 font-medium",
            currentQuestion === questions.length - 1
              ? "cursor-not-allowed text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-500",
          )}
          whileHover={currentQuestion !== questions.length - 1 ? { x: 4 } : {}}
          whileTap={currentQuestion !== questions.length - 1 ? { scale: 0.95 } : {}}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

