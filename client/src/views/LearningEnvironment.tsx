"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useParams } from "react-router-dom"
import Navbar from "../views/Navbar"
import { Sidebar } from "../curriculum/components/sidebar"
import { VideoPlayer } from "../curriculum/components/video-player"
import { Quiz } from "../curriculum/components/quiz"
import { AiTutor } from "../curriculum/components/ai-tutor"
import { ReadContent } from "../curriculum/components/read-content"

export type ContentType = "read" | "video" | "quiz" | "tutor"

const COURSE_DATA = {
  mern: {
    title: "MERN Stack Development",
    topics: ["React Fundamentals", "Node.js Basics", "MongoDB", "Express API Development"]
  },
  aiml: {
    title: "AI & Machine Learning",
    topics: ["Python for ML", "Neural Networks", "Computer Vision", "Natural Language Processing"]
  },
  cs: {
    title: "CS Core Concepts",
    topics: ["Data Structures", "Algorithms", "Operating Systems", "System Design"]
  }
}

function LearningEnvironment() {
  const { courseId } = useParams<{ courseId: keyof typeof COURSE_DATA }>()
  const [activeContent, setActiveContent] = useState<ContentType>("read")

  const courseData = COURSE_DATA[courseId || 'mern']

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar 
          activeContent={activeContent} 
          setActiveContent={setActiveContent}
          courseTitle={courseData.title}
        />
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeContent === "read" && <ReadContent courseId={courseId} key="read" />}
            {activeContent === "video" && <VideoPlayer courseId={courseId} key="video" />}
            {activeContent === "quiz" && <Quiz courseId={courseId} key="quiz" />}
            {activeContent === "tutor" && <AiTutor courseId={courseId} key="tutor" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default LearningEnvironment
