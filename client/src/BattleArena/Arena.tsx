import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Crown } from "lucide-react"
import QuestionDisplay from "./question-display"
import Timer from "./timer"

// Mock data for demonstration
const QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "What is the largest mammal?",
    options: ["Elephant", "Giraffe", "Blue Whale", "Hippopotamus"],
    correctAnswer: "Blue Whale",
  },
  {
    id: 4,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: "Oxygen",
  },
  {
    id: 5,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
  },
]

type BattleState = "waiting" | "pairing" | "starting" | "question" | "feedback" | "finished"

export default function BattleArena() {
  const [battleState, setBattleState] = useState<BattleState>("waiting")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [user1Score, setUser1Score] = useState(0)
  const [user2Score, setUser2Score] = useState(0)
  const [user1Answer, setUser1Answer] = useState<string | null>(null)
  const [user2Answer, setUser2Answer] = useState<string | null>(null)
  const [user1Locked, setUser1Locked] = useState(false)
  const [user2Locked, setUser2Locked] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false)
  const [winner, setWinner] = useState<"user1" | "user2" | "tie" | null>(null)

  // Start battle when button is clicked
  const startBattle = () => {
    setBattleState("pairing")

    // Simulate finding an opponent after 2 seconds
    setTimeout(() => {
      setBattleState("starting")

      // Start the first question after the intro animation
      setTimeout(() => {
        setBattleState("question")
      }, 3000)
    }, 2000)
  }

  // Handle answer selection for user1 (the current user)
  const handleUser1Selection = (answer: string) => {
    if (!user1Locked) {
      setUser1Answer(answer)
    }
  }

  // Simulate user2 (opponent) selecting an answer
  useEffect(() => {
    if (battleState === "question" && !user2Locked) {
      const delay = Math.random() * 15000 + 5000 // Random time between 5-20 seconds
      const timeoutId = setTimeout(() => {
        const options = QUESTIONS[currentQuestionIndex].options
        const randomAnswer = options[Math.floor(Math.random() * options.length)]
        setUser2Answer(randomAnswer)
        setUser2Locked(true)

        // If user1 has also locked in, proceed to feedback
        if (user1Locked) {
          handleBothAnswersLocked()
        }
      }, delay)

      return () => clearTimeout(timeoutId)
    }
  }, [battleState, currentQuestionIndex, user1Locked, user2Locked])

  // Lock in user1's answer
  const lockAnswer = () => {
    if (user1Answer && !user1Locked) {
      setUser1Locked(true)

      // If user2 has also locked in, proceed to feedback
      if (user2Locked) {
        handleBothAnswersLocked()
      }
    }
  }

  // Handle when both users have locked in their answers
  const handleBothAnswersLocked = () => {
    setBattleState("feedback")

    // Calculate scores
    const correctAnswer = QUESTIONS[currentQuestionIndex].correctAnswer

    if (user1Answer === correctAnswer) {
      setUser1Score((prev) => prev + 1)
    }

    if (user2Answer === correctAnswer) {
      setUser2Score((prev) => prev + 1)
    }

    // Move to next question or end battle after 3 seconds
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setUser1Answer(null)
        setUser2Answer(null)
        setUser1Locked(false)
        setUser2Locked(false)
        setTimeExpired(false)
        setBattleState("question")
      } else {
        // End the battle
        setBattleState("finished")

        // Determine winner
        if (user1Score > user2Score) {
          setWinner("user1")
        } else if (user2Score > user1Score) {
          setWinner("user2")
        } else {
          setWinner("tie")
        }
      }
    }, 3000)
  }

  // Handle when time expires
  const handleTimeExpired = () => {
    if (battleState === "question") {
      setTimeExpired(true)
      setBattleState("feedback")

      // Calculate scores
      const correctAnswer = QUESTIONS[currentQuestionIndex].correctAnswer

      if (user1Answer === correctAnswer) {
        setUser1Score((prev) => prev + 1)
      }

      if (user2Answer === correctAnswer) {
        setUser2Score((prev) => prev + 1)
      }

      // Move to next question or end battle after 3 seconds
      setTimeout(() => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1)
          setUser1Answer(null)
          setUser2Answer(null)
          setUser1Locked(false)
          setUser2Locked(false)
          setTimeExpired(false)
          setBattleState("question")
        } else {
          // End the battle
          setBattleState("finished")

          // Determine winner
          if (user1Score > user2Score) {
            setWinner("user1")
          } else if (user2Score > user1Score) {
            setWinner("user2")
          } else {
            setWinner("tie")
          }
        }
      }, 3000)
    }
  }

  // Reset the battle
  const resetBattle = () => {
    setBattleState("waiting")
    setCurrentQuestionIndex(0)
    setUser1Score(0)
    setUser2Score(0)
    setUser1Answer(null)
    setUser2Answer(null)
    setUser1Locked(false)
    setUser2Locked(false)
    setTimeExpired(false)
    setWinner(null)
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-6 z-10">
        <h1 className="text-white font-bold text-xl">Quiz Battle</h1>
        {battleState === "waiting" && (
          <Button onClick={startBattle} className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Battle
          </Button>
        )}
        {battleState !== "waiting" && (
          <div className="flex items-center space-x-4">
            <div className="text-white font-medium">
              Question: {currentQuestionIndex + 1}/{QUESTIONS.length}
            </div>
            <Button
              variant="outline"
              onClick={resetBattle}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Exit Battle
            </Button>
          </div>
        )}
      </div>

      {/* Waiting State */}
      {battleState === "waiting" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h2 className="text-white text-3xl font-bold mb-6">Ready for a Battle?</h2>
          <p className="text-slate-300 mb-8">Click "Start Battle" in the navbar to find an opponent</p>
          <Button onClick={startBattle} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Battle
          </Button>
        </motion.div>
      )}

      {/* Pairing State */}
      {battleState === "pairing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h2 className="text-white text-3xl font-bold mb-6">Finding an Opponent</h2>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        </motion.div>
      )}

      {/* Battle Starting Animation */}
      {battleState === "starting" && (
        <div className="w-full h-full flex items-center justify-center">
          {/* User 1 Avatar (Blue) */}
          <motion.div
            initial={{ y: 500, x: -200 }}
            animate={{ y: 0, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute"
          >
            <Avatar className="h-32 w-32 border-4 border-blue-500 bg-slate-800">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User 1" />
              <AvatarFallback className="bg-blue-900 text-white text-2xl">U1</AvatarFallback>
            </Avatar>
          </motion.div>

          {/* User 2 Avatar (Red) */}
          <motion.div
            initial={{ y: 500, x: 200 }}
            animate={{ y: 0, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute"
          >
            <Avatar className="h-32 w-32 border-4 border-red-500 bg-slate-800">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User 2" />
              <AvatarFallback className="bg-red-900 text-white text-2xl">U2</AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Battle Start Text */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute"
          >
            <motion.h2
              className="text-white text-6xl font-bold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 1.8, duration: 0.8, times: [0, 0.5, 1] }}
            >
              BATTLE START!
            </motion.h2>
          </motion.div>
        </div>
      )}

      {/* Question State */}
      {(battleState === "question" || battleState === "feedback") && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* User Avatars */}
          <div className="absolute bottom-8 left-8 flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-red-500 bg-slate-800">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User 2" />
              <AvatarFallback className="bg-red-900 text-white">U2</AvatarFallback>
            </Avatar>
            <div className="mt-2 text-white font-bold">Opponent</div>
            <div className="mt-1 text-white">Score: {user2Score}</div>

            {/* Feedback indicator */}
            {battleState === "feedback" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="mt-2"
              >
                {user2Answer === QUESTIONS[currentQuestionIndex].correctAnswer ? (
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-2">
                    <X className="h-6 w-6 text-white" />
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className="absolute bottom-8 right-8 flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-blue-500 bg-slate-800">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User 1" />
              <AvatarFallback className="bg-blue-900 text-white">U1</AvatarFallback>
            </Avatar>
            <div className="mt-2 text-white font-bold">You</div>
            <div className="mt-1 text-white">Score: {user1Score}</div>

            {/* Feedback indicator */}
            {battleState === "feedback" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="mt-2"
              >
                {user1Answer === QUESTIONS[currentQuestionIndex].correctAnswer ? (
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-2">
                    <X className="h-6 w-6 text-white" />
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Question Display */}
          <div className="w-full max-w-3xl px-6">
            <QuestionDisplay
              question={QUESTIONS[currentQuestionIndex]}
              selectedAnswer={user1Answer}
              onSelectAnswer={handleUser1Selection}
              isLocked={user1Locked}
              showCorrectAnswer={battleState === "feedback"}
            />

            {/* Lock Answer Button */}
            {battleState === "question" && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={lockAnswer}
                  disabled={!user1Answer || user1Locked}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-700"
                >
                  {user1Locked ? "Answer Locked" : "Lock Answer"}
                </Button>
              </div>
            )}
          </div>

          {/* Timer */}
          {battleState === "question" && (
            <div className="absolute top-24">
              <Timer duration={30} onExpire={handleTimeExpired} isPaused={user1Locked && user2Locked} />
            </div>
          )}

          {/* Feedback Message */}
          {battleState === "feedback" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-24 bg-slate-800 px-6 py-3 rounded-lg"
            >
              <p className="text-white text-xl font-medium">
                Correct Answer:{" "}
                <span className="text-green-400 font-bold">{QUESTIONS[currentQuestionIndex].correctAnswer}</span>
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Battle Finished */}
      {battleState === "finished" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h2 className="text-white text-4xl font-bold mb-8">Battle Complete!</h2>

          <div className="flex justify-center space-x-24 mb-12">
            {/* User 2 (Opponent) */}
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-red-500 bg-slate-800">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User 2" />
                <AvatarFallback className="bg-red-900 text-white text-xl">U2</AvatarFallback>
              </Avatar>
              <div className="mt-3 text-white font-bold text-xl">Opponent</div>
              <div className="mt-1 text-white text-2xl">{user2Score} points</div>

              {winner === "user2" && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute mt-[-30px]"
                >
                  <Crown className="h-10 w-10 text-yellow-400" />
                </motion.div>
              )}
            </div>

            {/* User 1 (You) */}
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-blue-500 bg-slate-800">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User 1" />
                <AvatarFallback className="bg-blue-900 text-white text-xl">U1</AvatarFallback>
              </Avatar>
              <div className="mt-3 text-white font-bold text-xl">You</div>
              <div className="mt-1 text-white text-2xl">{user1Score} points</div>

              {winner === "user1" && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute mt-[-30px]"
                >
                  <Crown className="h-10 w-10 text-yellow-400" />
                </motion.div>
              )}
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h3 className="text-white text-3xl font-bold">
              {winner === "user1" && "You Won! 🎉"}
              {winner === "user2" && "Opponent Won!"}
              {winner === "tie" && "It's a Tie!"}
            </h3>
          </motion.div>

          <Button onClick={resetBattle} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  )
}

