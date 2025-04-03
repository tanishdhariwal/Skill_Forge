"use client"

import { motion } from "framer-motion"

interface ReadContentProps {
  title?: string;
  subtitle?: string;
  content?: string;
}

export function ReadContent({ title = "", subtitle = "", content = "" }: ReadContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-gray-400">{subtitle}</p>
      </div>

      <div className="flex-1 rounded-xl bg-gray-800/50 p-6 border border-gray-700 overflow-auto">
        <article className="prose prose-invert max-w-none">
          {/* Use the markdown content from props */}
          {content}
        </article>
      </div>
    </motion.div>
  )
}

