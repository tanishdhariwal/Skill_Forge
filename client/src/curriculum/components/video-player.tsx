"use client"

import { motion } from "framer-motion"

interface VideoPlayerProps {
  videoUrl: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Video Lecture</h1>
        <p className="text-gray-400">Watch and learn at your own pace</p>
      </div>

      <div className="flex-1 rounded-xl bg-gray-800/50 border border-gray-700 overflow-hidden">
        <div className="aspect-video w-full">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </motion.div>
  )
}

