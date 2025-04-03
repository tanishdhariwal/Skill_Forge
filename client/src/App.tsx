"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Navbar } from "./curriculum/navbar"
import { Sidebar } from "./curriculum/sidebar"
import { VideoPlayer } from "./curriculum/video-player"
import { Quiz } from "./curriculum/quiz"
import { AiTutor } from "./curriculum/ai-tutor"
import { ReadContent } from "./curriculum/read-content"

export type ContentType = "read" | "video" | "quiz" | "tutor"

function App() {
  const [activeContent, setActiveContent] = useState<ContentType>("video")

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
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

export default App

