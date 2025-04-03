"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"

export function VideoPlayer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Advanced React Hooks</h1>
        <p className="text-gray-400">Learn how to use React hooks effectively in your applications</p>
      </div>

      <motion.div
        className="relative flex-1 rounded-xl bg-gray-800/50 overflow-hidden border border-gray-700"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/90 text-white shadow-lg shadow-blue-500/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-8 w-8" />
          </motion.button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-semibold text-white">Using useCallback for Performance Optimization</h3>
          <p className="text-gray-300">Duration: 12:45 • Instructor: Sarah Johnson</p>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="rounded-lg bg-gray-800/50 p-4 border border-gray-700/50"
            whileHover={{ y: -5, backgroundColor: "rgba(31, 41, 55, 0.8)" }}
          >
            <h3 className="font-medium text-gray-200">
              {i === 1 ? "Introduction" : i === 2 ? "Basic Concepts" : "Advanced Usage"}
            </h3>
            <p className="text-sm text-gray-400">{i === 1 ? "3:24" : i === 2 ? "8:12" : "15:40"}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

