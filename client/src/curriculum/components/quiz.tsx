"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, X, Trophy, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Groq } from "groq-sdk"
import { Loader2 } from "lucide-react"
import { useAuth } from "./../../context/AuthContext"

export function Quiz({ subject, topic, id }: { subject: string; topic: string; id: string }) {
  const [questions, setQuestions] = useState<any[]>([])
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [quizOver, setQuizOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [fetched, setFetched] = useState(false)
  
  const { user } = useAuth()
  
  useEffect(() => {
    if (started && !fetched) {
      const fetchQuestions = async () => {
        try {
          const apiKey = "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";
          const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
          
          const prompt = `Generate 5 multiple-choice questions about ${subject} specifically focusing on ${topic}. 
          Format the response as a valid JavaScript array with each question object having these exact keys: 
          "question" (string), "options" (array of 4 strings), and "correctAnswer" (number index 0-3).
          Do not include any explanations or text outside the array.`;
          
          const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-8b-8192",
          });
          
          const responseContent = completion.choices[0]?.message?.content || "";
          const cleanedContent = responseContent
            .replace(/```javascript|```json|```|[\n\r]/g, "")
            .trim();
          
          const parsedQuestions = JSON.parse(cleanedContent);
          setQuestions(parsedQuestions);
          setFetched(true);
        } catch (error) {
          console.error("Error fetching questions:", error);
          if (!fetched) {
            setTimeout(fetchQuestions, 3000); // Retry after 3 seconds
          }
        }
      };
      
      fetchQuestions();
    }
  }, [started, fetched, subject, topic]);
  
  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionIndex,
    });
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let newScore = 0;
      for (let i = 0; i < questions.length; i++) {
        if (selectedOptions[i] === questions[i].correctAnswer) {
          newScore++;
        }
      }
      console.log("Score:", newScore); // Log the user score
      setScore(newScore);
      setQuizOver(true);
      
      // If perfect score, award badge (use questions.length for flexibility)
      if (newScore === questions.length && user) {
        // Award badge logic here...
        
      }
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptions({});
    setScore(0);
    setQuizOver(false);
  };
  
  if (!started) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-6">Quiz: {topic}</h1>
        <motion.button
          onClick={() => setStarted(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Quiz
        </motion.button>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-400">Loading questions...</p>
      </div>
    );
  }
  
  if (quizOver) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center"
      >
        <div className="mb-6 flex flex-col items-center">
          {score === questions.length ? (
            <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
          ) : score >= questions.length / 2 ? (
            <Check className="h-16 w-16 text-green-500 mb-4" />
          ) : (
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          )}
          <h1 className="text-2xl font-bold text-white">Quiz Completed!</h1>
          <p className="text-gray-400 mt-2">
            You scored {score} out of {questions.length}
          </p>
        </div>
        
        <motion.button
          onClick={restartQuiz}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Restart Quiz
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Quiz: {topic}</h1>
        <p className="text-gray-400">Test your knowledge of {subject}</p>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 10 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gray-800/50 p-6 border border-gray-700 h-full"
          >
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <h2 className="mt-2 text-xl font-semibold text-white">{questions[currentQuestion]?.question}</h2>
            </div>

            <div className="space-y-3">
              {questions[currentQuestion]?.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionSelect(currentQuestion, index)}
                  className={cn(
                    "relative flex w-full items-center rounded-lg border p-4 text-left transition-all",
                    selectedOptions[currentQuestion] === index
                      ? "border-green-500 bg-green-500/10 text-white"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50",
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
                    {selectedOptions[currentQuestion] === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-3 w-3 rounded-full bg-green-500"
                      />
                    )}
                  </div>
                  <span>{option}</span>
                  {selectedOptions[currentQuestion] === index && <Check className="ml-auto h-5 w-5 text-green-500" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-between">
        <motion.button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className={cn(
            "flex items-center rounded-lg px-4 py-2 font-medium",
            currentQuestion === 0 ? "cursor-not-allowed text-gray-500" : "bg-gray-800 text-white hover:bg-gray-700",
          )}
          whileHover={currentQuestion !== 0 ? { x: -4 } : {}}
          whileTap={currentQuestion !== 0 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </motion.button>
        <motion.button
          onClick={handleNextQuestion}
          disabled={selectedOptions[currentQuestion] === undefined}
          className={cn(
            "flex items-center rounded-lg px-4 py-2 font-medium",
            selectedOptions[currentQuestion] === undefined
              ? "cursor-not-allowed text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-500",
          )}
          whileHover={selectedOptions[currentQuestion] !== undefined ? { x: 4 } : {}}
          whileTap={selectedOptions[currentQuestion] !== undefined ? { scale: 0.95 } : {}}
        >
          {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

