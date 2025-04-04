"use client"

import { motion } from "framer-motion"
import { useCallback } from "react"
import { Mic, Play, Pause, Square } from "lucide-react"
import ReactMarkdown from "react-markdown" // new import

interface ReadContentProps {
  title?: string;
  subtitle?: string;
  content?: string;
}

export function ReadContent({ title = "", subtitle = "", content = "" }: ReadContentProps) {
  
  const handlePlay = useCallback(() => {
    if ("speechSynthesis" in window && content) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(content);
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [content]);

  const handlePause = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  }, []);

  const handleEnd = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

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
          <ReactMarkdown>{content}</ReactMarkdown> {/* rendering markdown */}
        </article>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handlePlay}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center"
          >
            <Play className="h-4 w-4 inline-block mr-2" /> Play
          </button>
          <button
            onClick={handlePause}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center"
          >
            <Pause className="h-4 w-4 inline-block mr-2" /> Pause
          </button>
          <button
            onClick={handleEnd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center"
          >
            <Square className="h-4 w-4 inline-block mr-2" /> End
          </button>
        </div>
      </div>
    </motion.div>
  )
}

