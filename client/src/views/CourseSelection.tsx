import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Card } from "@/components/ui/card";

const courses = [
  {
    id: "mern",
    title: "MERN Stack Development",
    description: "Master MongoDB, Express.js, React, and Node.js",
    icon: "🌐",
    color: "from-blue-500/20 to-cyan-500/20",
    topics: ["MongoDB", "Express.js", "React", "Node.js", "REST APIs"]
  },
  {
    id: "aiml",
    title: "AI & Machine Learning",
    description: "Learn AI fundamentals and machine learning algorithms",
    icon: "🤖",
    color: "from-purple-500/20 to-pink-500/20",
    topics: ["Python", "TensorFlow", "Neural Networks", "Computer Vision", "NLP"]
  },
  {
    id: "cs",
    title: "CS Core Concepts",
    description: "Build strong computer science fundamentals",
    icon: "💻",
    color: "from-green-500/20 to-emerald-500/20",
    topics: ["Data Structures", "Algorithms", "Operating Systems", "Networks", "System Design"]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function CourseSelection() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 pt-20">
        <motion.div
          className="container mx-auto px-4 py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Choose Your Learning Path</h1>
            <p className="text-gray-400 text-lg">Select a course to begin your journey</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`h-full bg-gradient-to-br ${course.color} border border-white/10 cursor-pointer overflow-hidden relative group`}
                  onClick={() => navigate(`/learn/${course.id}`)}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="text-4xl mb-4">{course.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-300 mb-4">{course.description}</p>
                    <div className="mt-auto">
                      <h4 className="text-sm font-semibold text-white/80 mb-2">Topics covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.topics.map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
