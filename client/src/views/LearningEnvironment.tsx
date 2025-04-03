"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useParams } from "react-router-dom"
import Navbar from "../views/Navbar"
import { Sidebar } from "../curriculum/components/sidebar"
import { VideoPlayer } from "../curriculum/components/video-player"
import { Quiz } from "../curriculum/components/quiz"
import { AiTutor } from "../curriculum/components/ai-tutor"
import { ReadContent } from "../curriculum/components/read-content"
import { ChevronRight } from "lucide-react"

export type ContentType = "read" | "video" | "quiz" | "tutor"

const COURSE_DATA = {
  mern: {
    title: "MERN Stack Development",
    topics: [
      {
        id: 1,
        title: "React Fundamentals",
        content: {
          read: "Learn the basics of React including components, props, and state",
          video: "https://youtube.com/embed/xyz123",
          quiz: [
            {
              question: "What is a React component?",
              options: ["A function", "A class", "Both A and B", "None"],
              answer: 2
            }
          ]
        }
      },
      {
        id: 2,
        title: "Node.js Basics",
        content: {
          read: "Introduction to Node.js and server-side JavaScript",
          video: "https://youtube.com/embed/abc456",
          quiz: [
            {
              question: "What is Node.js?",
              options: ["A browser", "A runtime environment", "A framework", "A language"],
              answer: 1
            }
          ]
        }
      },
      {
        id: 3,
        title: "MongoDB Integration",
        content: {
          read: "Working with MongoDB and Mongoose ODM",
          video: "https://youtube.com/embed/def789",
          quiz: [
            {
              question: "MongoDB is a _____ database?",
              options: ["SQL", "NoSQL", "Graph", "None"],
              answer: 1
            }
          ]
        }
      }
    ]
  },
  aiml: {
    title: "AI & Machine Learning",
    topics: [
      {
        id: 1,
        title: "Python for ML",
        content: {
          read: "Python fundamentals for machine learning",
          video: "https://youtube.com/embed/ml123",
          quiz: [
            {
              question: "Which library is commonly used for ML in Python?",
              options: ["React", "TensorFlow", "Express", "MongoDB"],
              answer: 1
            }
          ]
        }
      }
    ]
  }
};

function LearningEnvironment() {
  const { courseId } = useParams<{ courseId: keyof typeof COURSE_DATA }>();
  const [activeContent, setActiveContent] = useState<ContentType>("video");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const courseData = COURSE_DATA[courseId || 'mern'];

  if (!selectedTopic) {
    return (
      <div className="flex h-screen flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <Navbar />
        <div className="flex-1 pt-16 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">{courseData.title}</h1>
            <div className="grid gap-6">
              {courseData.topics.map((topic) => (
                <motion.div
                  key={topic.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-700/50 transition-colors"
                  onClick={() => setSelectedTopic(topic.id)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">{topic.title}</h2>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentTopic = courseData.topics.find(t => t.id === selectedTopic);

  if (!currentTopic) {
    return <div>Topic not found</div>;
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar 
          activeContent={activeContent} 
          setActiveContent={setActiveContent}
          courseTitle={currentTopic.title}
        />
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeContent === "read" && <ReadContent content={currentTopic.content.read} key="read" />}
            {activeContent === "video" && <VideoPlayer videoUrl={currentTopic.content.video} key="video" />}
            {activeContent === "quiz" && <Quiz questions={currentTopic.content.quiz} key="quiz" />}
            {activeContent === "tutor" && <AiTutor context={currentTopic.title} key="tutor" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default LearningEnvironment;
