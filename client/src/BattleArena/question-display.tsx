"use client"

import { motion } from "framer-motion"

type Question = {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

type QuestionDisplayProps = {
  question: Question
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
  isLocked: boolean
  showCorrectAnswer: boolean
}

export default function QuestionDisplay({
  question,
  selectedAnswer,
  onSelectAnswer,
  isLocked,
  showCorrectAnswer,
}: QuestionDisplayProps) {
  return (
    <div className="w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-white text-2xl font-bold mb-6 text-center"
      >
        {question.question}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            onClick={() => !isLocked && onSelectAnswer(option)}
            className={`
              p-4 rounded-lg cursor-pointer transition-all
              ${isLocked && selectedAnswer !== option ? "opacity-50" : ""}
              ${
                selectedAnswer === option
                  ? "bg-blue-600 border-2 border-blue-400"
                  : "bg-slate-800 hover:bg-slate-700 border-2 border-slate-700"
              }
              ${showCorrectAnswer && option === question.correctAnswer ? "bg-green-600 border-2 border-green-400" : ""}
              ${
                showCorrectAnswer && selectedAnswer === option && option !== question.correctAnswer
                  ? "bg-red-600 border-2 border-red-400"
                  : ""
              }
            `}
          >
            <p className="text-white text-lg font-medium">{option}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

