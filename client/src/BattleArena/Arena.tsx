import { useState, useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Crown } from "lucide-react"
import QuestionDisplay from "./question-display"
import Timer from "./timer"
import { io, Socket } from "socket.io-client"
import { useQuizAuth } from "../context/QuizAuthContext"
import toast from 'react-hot-toast'
//import { useToast } from "@/components/ui/use-toast"; // Add this if using shadcn

type BattleState = "waiting" | "pairing" | "starting" | "question" | "feedback" | "finished"

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  startTime?: number; // Add startTime
}

interface QuestionResult {
  question: number;
  correct: boolean;
}

interface Player {
  userId: string;
  score: number;
  currentQuestion: number;
  results: QuestionResult[]; // Track each answer's correctness
}

export default function BattleArena() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [battleState, setBattleState] = useState<BattleState>("waiting")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [battleId, setBattleId] = useState<string | null>(null)
  const [user1Score, setUser1Score] = useState(0)
  const [user2Score, setUser2Score] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [opponent, setOpponent] = useState<string | null>(null)
  const [timeExpired, setTimeExpired] = useState(false)
  const [winner, setWinner] = useState<"user1" | "user2" | "tie" | null>(null)
  const { quizUser } = useQuizAuth()
  const [battleAnimationPhase, setBattleAnimationPhase] = useState<"entrance" | "reposition">("entrance");
  const [user1Results, setUser1Results] = useState<QuestionResult[]>([])
  const [user2Results, setUser2Results] = useState<QuestionResult[]>([])
  const [questionNumber, setQuestionNumber] = useState(0)
  const [opponentAnswer, setOpponentAnswer] = useState<string | null>(null)
  const [opponentLocked, setOpponentLocked] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number | undefined>();
  const [connectionLost, setConnectionLost] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeftForQuestion, setTimeLeftForQuestion] = useState(30); // Track time left for current question
  //const { toast } = useToast(); // Add this if using shadcn, or use react-hot-toast directly
  const [questionResults, setQuestionResults] = useState<Map<number, {user1Correct: boolean, user2Correct: boolean}>>(
    new Map()
  );

  const blueAvatarVariants = {
    initial: { y: "100%", opacity: 0 },
    entrance: { y: 0, x: -50, opacity: 1, transition: { duration: 1 } },
    reposition: { x: 300, y: 200, transition: { duration: 1 } }
  };

  const redAvatarVariants = {
    initial: { y: "100%", opacity: 0 },
    entrance: { y: 0, x: 50, opacity: 1, transition: { duration: 1 } },
    reposition: { x: -300, y: 200, transition: { duration: 1 } }
  };

  useEffect(() => {
    // Initialize socket connection
    let newSocket: Socket | null = io("http://localhost:4000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    setSocket(newSocket);

    // Setup reconnection logic
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setConnectionLost(false);
      setReconnecting(false);
      
      // If we have an active battle, try to rejoin
      if (battleId && quizUser?.username) {
        newSocket?.emit("rejoinMatch", {
          userId: quizUser.username,
          battleId: battleId
        });
      }
      
      // Setup ping to keep connection alive
      if (pingTimerRef.current) {
        clearInterval(pingTimerRef.current);
      }
      
      pingTimerRef.current = setInterval(() => {
        newSocket?.emit("ping");
      }, 20000); // Ping every 20 seconds
    });
    
    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnectionLost(true);
      setReconnecting(true);
    });
    
    newSocket.on("reconnect", () => {
      console.log("Socket reconnected");
      setConnectionLost(false);
      setReconnecting(false);
    });
    
    newSocket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
      setReconnecting(true);
    });
    
    newSocket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });
    
    newSocket.on("reconnect_failed", () => {
      console.error("Failed to reconnect");
      setReconnecting(false);
      
      // Setup reconnect timer
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      
      reconnectTimerRef.current = setTimeout(() => {
        window.location.reload(); // Reload page as last resort
      }, 5000);
    });
    
    newSocket.on("rejoinSuccess", (data) => {
      console.log("Successfully rejoined match:", data);
      setCurrentQuestion({
        question: data.question.question,
        options: data.question.options,
        correctAnswer: ""
      });
      setQuestionStartTime(data.question.startTime);
      setQuestionNumber(data.currentQuestionIndex + 1);
      setUser1Score(data.myScore);
      setUser2Score(data.opponentScore);
      setOpponent(data.opponentId);
      setBattleState("question");
    });

    // Socket event listeners
    newSocket.on("matchFound", (data) => {
      console.log("Match found:", data)
      setBattleId(data.quizId)
      setOpponent(data.player1 === quizUser?.username ? data.player2 : data.player1)
      setBattleState("starting")
      setBattleAnimationPhase("entrance")
      // Reset all game state
      setUser1Score(0);
      setUser2Score(0);
      setUser1Results([]);
      setUser2Results([]);
      setQuestionNumber(0);
      setTimeExpired(false);
      // Animate entrance then reposition then transition to question state
      setTimeout(() => {
        setBattleAnimationPhase("reposition")
        setTimeout(() => {
          setBattleState("question")
        }, 1500)
      }, 2000)
    })

    newSocket.on("nextQuestion", (data) => {
      console.log("Next question received:", data);
      
      // Reset states for new question
      setCurrentQuestion({
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer || ""
      });
      setQuestionStartTime(data.startTime);
      setSelectedAnswer(null);
      setIsLocked(false);
      setOpponentAnswer(null);
      setOpponentLocked(false);
      setTimeExpired(false);
      
      // Only increment question number if this is actually a new question
      if (data.questionIndex !== questionNumber - 1) {
        setQuestionNumber(data.questionIndex + 1);
      }
      
      setBattleState("question");
    });

    newSocket.on("opponentAnswered", (data) => {
      console.log("Opponent answered:", data)
      setOpponentLocked(true)
      
      // If both users have now locked in their answers, notify the server
      if (isLocked) {
        console.log("Both users have locked answers, proceeding to next step")
        newSocket?.emit("bothAnswered", {
          battleId,
          questionNumber
        })
      }
    })

    newSocket.on("updateScore", (data) => {
      console.log("Score update:", data);
      
      // Store the correct answer from server
      if (currentQuestion && data.correctAnswer && !currentQuestion.correctAnswer) {
        setCurrentQuestion(prev => prev ? {
          ...prev,
          correctAnswer: data.correctAnswer
        } : null);
      }
      
      // Update scores
      if (data.userId === quizUser?.username) {
        // My results
        setUser1Score(data.newScore);
        
        // Track results in the map by question index
        setQuestionResults(prevResults => {
          const newMap = new Map(prevResults);
          const existingResult = newMap.get(data.questionIndex) || { user1Correct: false, user2Correct: false };
          
          newMap.set(data.questionIndex, {
            ...existingResult,
            user1Correct: data.lastAnswerCorrect
          });
          
          return newMap;
        });
        
        // Also update opponent data from the opponentInfo
        if (data.opponentInfo) {
          setUser2Score(data.opponentInfo.score);
          
          // Track opponent results by question index
          setQuestionResults(prevResults => {
            const newMap = new Map(prevResults);
            const existingResult = newMap.get(data.questionIndex) || { user1Correct: false, user2Correct: false };
            
            newMap.set(data.questionIndex, {
              ...existingResult,
              user2Correct: data.opponentInfo.correct
            });
            
            return newMap;
          });
        }
      } else {
        // Opponent's results (this branch may not be needed with the opponentInfo above)
        setUser2Score(data.newScore);
      }
      
      setBattleState("feedback");
      
      // Show feedback briefly before automatically moving to next question
      // The timer here doesn't matter as the server will push the next question
    })

    newSocket.on("matchOver", (data) => {
      console.log("Match over:", data)
      setBattleState("finished")
      
      // Calculate winner
      const finalScores = data.results
      const userScore = finalScores.find((s: { userId: string | undefined }) => s.userId === quizUser?.username)?.score || 0
      const opponentScore = finalScores.find((s: { userId: string | undefined }) => s.userId !== quizUser?.username)?.score || 0
      
      if (userScore > opponentScore) setWinner("user1")
      else if (opponentScore > userScore) setWinner("user2")
      else setWinner("tie")
    })
    
    newSocket.on("opponentDisconnected", (data) => {
      console.log("Opponent disconnected:", data);
      toast.error("Opponent disconnected");
      
      // We'll wait for matchOver event to handle the rest
    });

    return () => {
      // Clean up all timers and socket
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      
      newSocket?.close();
      setSocket(null);
    }
  }, [quizUser?.username]); // Remove dependencies that caused issues
  
  // Effect to ensure we're always sending locked status
  useEffect(() => {
    if (isLocked && opponentLocked && battleId && socket) {
      socket.emit("bothAnswered", {
        battleId,
        questionNumber
      });
    }
  }, [isLocked, opponentLocked, battleId, questionNumber]);

  // Convert questionResults map to arrays for display
  const computedUser1Results = useMemo(() => {
    return Array.from(questionResults.entries())
      .sort((a, b) => a[0] - b[0]) // Sort by question index
      .map(([qIndex, results]) => ({
        question: qIndex + 1,
        correct: results.user1Correct
      }));
  }, [questionResults]);
  
  const computedUser2Results = useMemo(() => {
    return Array.from(questionResults.entries())
      .sort((a, b) => a[0] - b[0]) // Sort by question index
      .map(([qIndex, results]) => ({
        question: qIndex + 1,
        correct: results.user2Correct
      }));
  }, [questionResults]);

  const startBattle = () => {
    setBattleState("pairing")
    socket?.emit("joinQueue", {
      userId: quizUser?.username,
      quizRating: quizUser?.quizRating || 1000 // Default rating if not set
    })
  }

  const handleAnswerSelection = (answer: string) => {
    if (!isLocked) {
      setSelectedAnswer(answer)
    }
  }

  // Modified lockAnswer function to handle timer stopping
  const lockAnswer = () => {
    if (selectedAnswer && !isLocked && battleId) {
      setIsLocked(true)
      socket?.emit("submitAnswer", {
        battleId,
        userId: quizUser?.username,
        answer: selectedAnswer,
        questionNumber
      })
      
      // If opponent has already locked in, notify the server that both are ready
      if (opponentLocked) {
        console.log("Both users have locked answers, proceeding to next step")
        socket?.emit("bothAnswered", {
          battleId,
          questionNumber
        })
      }
    }
  }

  const handleTimeExpired = () => {
    setTimeExpired(true);
    
    // Only submit if not already locked
    if (!isLocked && battleId) {
      setIsLocked(true); // Set locked to prevent multiple submissions
      socket?.emit("submitAnswer", {
        battleId,
        userId: quizUser?.username,
        answer: selectedAnswer || "", // Submit empty answer if none selected
        questionNumber
      });
    }
  };

  const resetBattle = () => {
    setBattleState("waiting");
    setCurrentQuestion(null);
    setBattleId(null);
    setUser1Score(0);
    setUser2Score(0);
    setSelectedAnswer(null);
    setIsLocked(false);
    setOpponent(null);
    setTimeExpired(false);
    setWinner(null);
    setUser1Results([]);
    setUser2Results([]);
    setQuestionNumber(0);
    setOpponentAnswer(null);
    setOpponentLocked(false);
  }

  // Add connection status indicators
  const renderConnectionStatus = () => {
    if (connectionLost) {
      return (
        <div className="fixed top-16 left-0 right-0 bg-red-600 text-white p-1 text-center z-50">
          {reconnecting ? "Reconnecting..." : "Connection lost. Please refresh the page."}
        </div>
      );
    }
    return null;
  };

  // Add a debug display for development
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="fixed top-20 right-5 bg-black/70 p-3 text-xs text-white rounded max-w-xs z-50">
          <div>Battle State: {battleState}</div>
          <div>Battle ID: {battleId || "none"}</div>
          <div>Question #: {questionNumber}</div>
          <div>Question: {currentQuestion?.question || "none"}</div>
          <div>Options: {currentQuestion?.options?.join(", ") || "none"}</div>
          <div>Locked: {isLocked ? "Yes" : "No"}</div>
          <div>Opp Locked: {opponentLocked ? "Yes" : "No"}</div>
        </div>
      )
    }
    return null;
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
      {/* Connection status */}
      {renderConnectionStatus()}
      
      {/* Debug panel */}
      {renderDebugInfo()}
      
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
              Question: {currentQuestion ? currentQuestion.question : "N/A"}
            </div>
            <Button
              variant="outline"
              onClick={() => setBattleState("waiting")}
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
        <div className="w-full h-full flex items-center justify-center relative">
          <motion.div
            variants={blueAvatarVariants}
            initial="initial"
            animate={battleAnimationPhase}
            className="absolute"
          >
            <Avatar className="h-32 w-32 border-4 border-blue-500 bg-slate-800">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User 1" />
              <AvatarFallback className="bg-blue-900 text-white text-2xl">U1</AvatarFallback>
            </Avatar>
          </motion.div>
          <motion.div
            variants={redAvatarVariants}
            initial="initial"
            animate={battleAnimationPhase}
            className="absolute"
          >
            <Avatar className="h-32 w-32 border-4 border-red-500 bg-slate-800">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User 2" />
              <AvatarFallback className="bg-red-900 text-white text-2xl">U2</AvatarFallback>
            </Avatar>
          </motion.div>
          {battleAnimationPhase === "reposition" && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
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
          )}
        </div>
      )}

      {/* Question State */}
      {(battleState === "question" || battleState === "feedback") && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* User Avatars with Result History */}
          <div className="absolute bottom-8 left-8 flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-red-500 bg-slate-800">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User 2" />
              <AvatarFallback className="bg-red-900 text-white">U2</AvatarFallback>
            </Avatar>
            <div className="mt-2 text-white font-bold">Opponent</div>
            <div className="mt-1 text-white">Score: {user2Score}</div>
            
            {/* Opponent's lock indicator */}
            {opponentLocked && battleState === "question" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-sm text-slate-300"
              >
                Answer locked
              </motion.div>
            )}

            {/* Result indicators for all previous questions */}
            <div className="mt-3 flex space-x-1">
              {computedUser2Results.map((result, idx) => (
                <motion.div
                  key={`opponent-result-${idx}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  {result.correct ? (
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : (
                    <div className="bg-red-500 rounded-full p-1">
                      <X className="h-3 w-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 right-8 flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-blue-500 bg-slate-800">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User 1" />
              <AvatarFallback className="bg-blue-900 text-white">U1</AvatarFallback>
            </Avatar>
            <div className="mt-2 text-white font-bold">You</div>
            <div className="mt-1 text-white">Score: {user1Score}</div>

            {/* User's lock indicator */}
            {isLocked && battleState === "question" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-sm text-slate-300"
              >
                Answer locked
              </motion.div>
            )}
            
            {/* Result indicators for all previous questions */}
            <div className="mt-3 flex space-x-1">
              {computedUser1Results.map((result, idx) => (
                <motion.div
                  key={`user-result-${idx}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  {result.correct ? (
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : (
                    <div className="bg-red-500 rounded-full p-1">
                      <X className="h-3 w-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Question Display - Fixed to better handle loading state */}
          <div className="w-full max-w-3xl px-6">
            {currentQuestion && currentQuestion.options && currentQuestion.options.length > 0 ? (
              <QuestionDisplay
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleAnswerSelection}
                isLocked={isLocked}
                showCorrectAnswer={battleState === "feedback"}
              />
            ) : (
              <div className="text-white text-center p-8 bg-slate-800 rounded-lg animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto mb-8"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-slate-700 rounded"></div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                </div>
                <p className="mt-8 text-slate-400">Loading question...</p>
              </div>
            )}

            {/* Lock Answer Button */}
            {battleState === "question" && currentQuestion && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={lockAnswer}
                  disabled={!selectedAnswer || isLocked}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-700"
                >
                  {isLocked ? "Answer Locked" : "Lock Answer"}
                </Button>
              </div>
            )}
          </div>

          {/* Question Counter */}
          <div className="absolute top-20 text-white text-sm">
            Question {questionNumber} of 5
          </div>

          {/* Timer */}
          {battleState === "question" && (
            <div className="absolute top-24">
              <motion.div
                animate={timeExpired ? { scale: 1.2, rotate: [0, 5, 0, -5, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Timer 
                  duration={30} 
                  onExpire={handleTimeExpired} 
                  isPaused={isLocked && opponentLocked} // Only pause if both users have locked
                  startTime={questionStartTime} 
                  key={`timer-${questionNumber}`} // Add key to force remounting for each question
                />
              </motion.div>
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
                <span className="text-green-400 font-bold">{currentQuestion?.correctAnswer}</span>
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

