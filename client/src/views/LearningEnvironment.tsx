"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import Navbar from "../views/Navbar"
import { Sidebar } from "../curriculum/components/sidebar"
import { VideoPlayer } from "../curriculum/components/video-player"
import { Quiz } from "../curriculum/components/quiz"
import { AiTutor } from "../curriculum/components/ai-tutor"
import { ReadContent } from "../curriculum/components/read-content"

export type ContentType = "read" | "video" | "quiz" | "tutor"

function LearningEnvironment() {
  const [activeContent, setActiveContent] = useState<ContentType>("video")

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar />
      <div className="flex flex-1  pt-16 overflow-hidden">

        <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeContent === "read" && <ReadContent key="read" />}
            {activeContent === "video" && <VideoPlayer key="video" />}
            {activeContent === "quiz" && <Quiz key="quiz" />}
            {activeContent === "tutor" && <AiTutor key="tutor" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default LearningEnvironment
