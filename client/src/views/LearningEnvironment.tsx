"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useParams } from "react-router-dom"
import Navbar from "../views/Navbar"
import { Sidebar } from "../curriculum/components/sidebar"
import { VideoPlayer } from "../curriculum/components/video-player"
// Update the import to use the Quiz component
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
          read: `React is a JavaScript library for building user interfaces, primarily using a component-based architecture. It allows developers to create reusable UI components that manage their own state, leading to efficient rendering. React uses a virtual DOM to optimize updates, ensuring better performance by minimizing direct manipulation of the actual DOM. JSX, a syntax extension, makes it easier to write UI components using a structure similar to HTML, making code more readable and maintainable.

React also includes hooks, such as useState and useEffect, which enable functional components to manage state and lifecycle events. State management solutions like Redux or React Context help manage complex application states across components. With tools like React Router for navigation and libraries like Tailwind CSS for styling, React simplifies the development of interactive and scalable front-end applications.`,
          video: "https://www.youtube.com/embed/f55qeKGgB_M",
          quiz: [
            {
              question: "What is the Virtual DOM?",
              options: ["A direct copy of the real DOM", "A lightweight copy of the real DOM", "A browser feature", "A database"],
              answer: 1
            },
            {
              question: "Which hook is used for side effects?",
              options: ["useState", "useEffect", "useContext", "useReducer"],
              answer: 1
            }
          ]
        }
      },
      {
        id: 2,
        title: "Express & Node.js",
        content: {
          read: `# Backend Development with Express

1. Node.js Core Concepts
   - Event Loop
   - Asynchronous Programming
   - Streams and Buffers
   - Error Handling

2. Express.js Framework
   - Routing
   - Middleware Architecture
   - Request/Response Cycle
   - Error Middleware

3. API Development
   - REST Principles
   - Controller Pattern
   - Input Validation
   - Authentication/Authorization`,
          video: "https://www.youtube.com/embed/Oe421EPjeBE",
          quiz: [
            {
              question: "What is Express.js?",
              options: ["Database", "Web Framework", "Programming Language", "Browser"],
              answer: 1
            }
          ]
        }
      },
      {
        id: 3,
        title: "MongoDB & Mongoose",
        content: {
          read: `# MongoDB and Mongoose

Database concepts and implementation:

- NoSQL database concepts
- MongoDB CRUD operations
- Mongoose ODM
- Schema design
- Data validation
- Indexing
- Relationships`,
          video: "https://www.youtube.com/embed/HXV3zeQKqGY",
          quiz: [
            {
              question: "MongoDB is a _____ database?",
              options: ["SQL", "NoSQL", "Graph", "None"],
              answer: 1
            },
            {
              question: "What is Mongoose?",
              options: ["Database", "ODM", "Programming language", "Web server"],
              answer: 1
            }
          ]
        }
      },
      {
        id: 4,
        title: "Full Stack Integration",
        content: {
          read: `# Full Stack Integration

Connecting frontend with backend:

- API integration
- Authentication & Authorization
- State management
- Deployment
- Performance optimization
- Security best practices`,
          video: "https://www.youtube.com/embed/7CqJlxBYj-M",
          quiz: [
            {
              question: "What is JWT used for?",
              options: ["Styling", "Authentication", "Database", "Routing"],
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
        title: "Python & Data Science Fundamentals",
        content: {
          read: `# Python for Data Science

1. Data Processing
   - NumPy Arrays
   - Pandas DataFrames
   - Data Cleaning
   - Feature Engineering

2. Data Visualization
   - Matplotlib
   - Seaborn
   - Interactive Plots
   - Statistical Visualization

3. Statistical Analysis
   - Descriptive Statistics
   - Inferential Statistics
   - Hypothesis Testing
   - Correlation Analysis`,
          video: "https://www.youtube.com/embed/LHBE6Q9XlzI",
          quiz: [
            {
              question: "Which library is best for data manipulation in Python?",
              options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
              answer: 1
            }
          ]
        }
      },
      {
        id: 2,
        title: "Machine Learning Basics",
        content: {
          read: `# Machine Learning Fundamentals

Core ML concepts:

- Supervised Learning
- Unsupervised Learning
- Model Training
- Feature Engineering
- Model Evaluation
- Cross Validation`,
          video: "https://www.youtube.com/embed/GwIo3gDZCVQ",
          quiz: [
            {
              question: "What is supervised learning?",
              options: ["Learning without labels", "Learning with labels", "Transfer learning", "None"],
              answer: 1
            }
          ]
        }
      },
      {
        id: 3,
        title: "Deep Learning",
        content: {
          read: `# Deep Learning

Neural Network concepts:

- Neural Networks
- Deep Neural Networks
- CNN
- RNN
- Transfer Learning
- Model Architecture`,
          video: "https://www.youtube.com/embed/VyWAvY2CF3c",
          quiz: [
            {
              question: "What is CNN best used for?",
              options: ["Text data", "Image data", "Time series", "Tabular data"],
              answer: 1
            }
          ]
        }
      }
    ]
  },
  react: {
    title: "Advanced React Development",
    topics: [
      {
        id: 1,
        title: "Advanced Hooks",
        content: {
          read: `# Advanced React Hooks

1. Complex Hook Patterns
   - useCallback
   - useMemo
   - useRef Advanced Usage
   - Custom Hook Design

2. Context & State Management
   - Context API Patterns
   - Global State Design
   - Performance Considerations
   - State Machines

3. Advanced Patterns
   - Compound Components
   - Render Props
   - Higher Order Components
   - Custom Hook Libraries`,
          video: "https://www.youtube.com/embed/TNhaISOUy6Q",
          quiz: [
            {
              question: "When should you use useMemo?",
              options: ["For all variables", "For expensive computations", "Never", "For strings only"],
              answer: 1
            }
          ]
        }
      },
      {
        id: 2,
        title: "Performance Optimization",
        content: {
          read: `# React Performance

1. React Performance Tools
   - React Profiler
   - Chrome DevTools
   - Performance Metrics
   - Lighthouse Analysis

2. Optimization Techniques
   - Code Splitting
   - Lazy Loading
   - Suspense
   - Memory Management`,
          video: "https://www.youtube.com/embed/YvXDZS8dv14",
          quiz: [
            {
              question: "What is code splitting?",
              options: ["Breaking CSS", "Breaking JS bundles", "Breaking components", "Breaking HTML"],
              answer: 1
            }
          ]
        }
      }
    ]
  }
};

function LearningEnvironment() {
  const { courseId = 'mern' } = useParams<{ courseId?: string }>();
  const [activeContent, setActiveContent] = useState<ContentType>("read");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  // Validate courseId type
  const validCourseId = courseId as keyof typeof COURSE_DATA;
  const courseData = COURSE_DATA[validCourseId] || COURSE_DATA['mern'];

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

  const currentTopic = courseData.topics.find(t => t.id === selectedTopic) || courseData.topics[0];

  if (!currentTopic) {
    return <div className="text-white p-6">Topic not found</div>;
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
            {activeContent === "read" && (
              <ReadContent 
                title={currentTopic?.title}
                subtitle={`${courseData.title} - Reading Material`}
                content={currentTopic?.content.read}
              />
            )}
            {activeContent === "video" && <VideoPlayer videoUrl={currentTopic.content.video} key="video" />}
            {/* Use the Quiz component directly instead of QuizGenerator */}
            {activeContent === "quiz" && (
              <Quiz 
                subject={courseData.title}
                topic={currentTopic.title}
                id={String(currentTopic.id)}
                key="quiz"
              />
            )}
            {activeContent === "tutor" && <AiTutor context={currentTopic.title} key="tutor" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default LearningEnvironment;
