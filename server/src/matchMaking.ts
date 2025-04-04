import { Server, Socket } from 'socket.io';
import mongoose from "mongoose";
import { GenMcqQuestions } from "./Api-helper/helper.js"; 

interface MatchRequest {
  userId: string;
  quizRating: number;
}

interface QueuedPlayer {
  userId: string;
  socketId: string;
  quizRating: number;
}

interface BattleMatch {
  quizId: string;
  player1: string;
  player2: string;
  socketMap: { [userId: string]: string };
  currentQuestionIndex: number;
  questions: Question[];
  answers: {
    [userId: string]: {
      answer: string;
      isCorrect: boolean;
    }
  };
  scores: {
    [userId: string]: number;
  };
  maxQuestions: number;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Expanded quiz questions with more clear options
const quizQuestions = [
  {
    question: "What is the primary function of the HTML tag 'head' in a web page?", 
    options: [
      'To define the structure of the web page',
      'To add visual styling to the web page',
      'To contain metadata about the web page',
      'To define the functionality of the web page'
    ],
    correctAnswer: 'To contain metadata about the web page'
  },
  {
    question: "What is the primary function of the HTML tag 'div' in web development?",
    options: [
      'To define a hyperlink',
      'To define a paragraph',
      'To define a division or a section in an HTML document',
      'To define a list item'
    ],
    correctAnswer: 'To define a division or a section in an HTML document'
  },
  {
    question: "What does CSS stand for in web development?",
    options: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style Sheets',
      'Colorful Style Sheets'
    ],
    correctAnswer: 'Cascading Style Sheets'
  },
  {
    question: "Which JavaScript method is used to access an HTML element by its ID?",
    options: [
      'getElementById()',
      'getElementByName()',
      'querySelector()',
      'findElement()'
    ],
    correctAnswer: 'getElementById()'
  },
  {
    question: "In React, what is the correct way to pass data from parent to child component?",
    options: [
      'Using global variables',
      'Using props',
      'Using state lifting',
      'Using context API'
    ],
    correctAnswer: 'Using props'
  },
  {
    question: "What is the purpose of the 'useEffect' hook in React?",
    options: [
      'To handle user events',
      'To manage component state',
      'To create side effects in components',
      'To optimize rendering performance'
    ],
    correctAnswer: 'To create side effects in components'
  }
];

export function setupMatchmaking(io: Server) {
  const matchmakingQueue: QueuedPlayer[] = [];
  const activeMatches: Record<string, BattleMatch> = {};
  const userSocketMapping: Record<string, string> = {};
  const questionTimeouts: Record<string, NodeJS.Timeout> = {};

  // Generate a unique match ID
  const generateMatchId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Select questions for a match
  const selectQuestions = (count: number = 5) => {
    // Shuffle and pick a subset of questions
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinQueue', (data: { userId: string, quizRating: number }) => {
      if (!data.userId) {
        socket.emit('error', { message: 'User ID is required' });
        return;
      }

      console.log(`User joined queue: ${data.userId}`);
      userSocketMapping[data.userId] = socket.id;

      const player: QueuedPlayer = {
        userId: data.userId,
        socketId: socket.id,
        quizRating: data.quizRating || 1000
      };

      // Add player to queue
      matchmakingQueue.push(player);
      
      // Try to match players
      matchPlayers(io);
    });

    socket.on('submitAnswer', (data: { battleId: string, userId: string, answer: string }) => {
      if (!data.battleId || !data.userId) {
        socket.emit('error', { message: 'Battle ID and User ID are required' });
        return;
      }

      const match = activeMatches[data.battleId];
      if (!match) {
        socket.emit('error', { message: 'Match not found' });
        return;
      }
      
      // Guard check: ensure currentQuestion exists
      if (match.currentQuestionIndex < 0 || match.currentQuestionIndex >= match.questions.length) {
        socket.emit('error', { message: 'No valid current question' });
        return;
      }
      
      const currentQuestion = match.questions[match.currentQuestionIndex];
      const isCorrect = data.answer === currentQuestion.correctAnswer;
      
      // Store the answer
      match.answers[data.userId] = {
        answer: data.answer,
        isCorrect
      };
      
      // Update score if correct
      if (isCorrect) {
        match.scores[data.userId] = (match.scores[data.userId] || 0) + 1;
      }

      // Notify opponent that this user has answered
      const opponentId = data.userId === match.player1 ? match.player2 : match.player1;
      const opponentSocket = userSocketMapping[opponentId] ? 
        io.sockets.sockets.get(userSocketMapping[opponentId]) : null;
      
      if (opponentSocket) {
        opponentSocket.emit('opponentAnswered', { userId: data.userId });
      }

      // Check if both players have answered
      checkBothAnswered(match, io);
    });

    socket.on('bothAnswered', (data: { battleId: string }) => {
      if (!data.battleId) {
        socket.emit('error', { message: 'Battle ID is required' });
        return;
      }

      const match = activeMatches[data.battleId];
      if (!match) {
        socket.emit('error', { message: 'Match not found' });
        return;
      }

      // Process answers immediately since both players have answered
      processAnswers(match, io);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Remove from queue if they were queued
      const queueIndex = matchmakingQueue.findIndex(p => p.socketId === socket.id);
      if (queueIndex !== -1) {
        matchmakingQueue.splice(queueIndex, 1);
      }
      
      // Find user ID associated with this socket
      let userId = null;
      for (const [key, value] of Object.entries(userSocketMapping)) {
        if (value === socket.id) {
          userId = key;
          break;
        }
      }
      
      if (userId) {
        console.log(`Removing user socket mapping for ${userId}`);
        delete userSocketMapping[userId];
        
        // Handle disconnection from active matches
        for (const matchId in activeMatches) {
          const match = activeMatches[matchId];
          if (match.player1 === userId || match.player2 === userId) {
            // Notify the other player that opponent disconnected
            const otherPlayerId = match.player1 === userId ? match.player2 : match.player1;
            const otherPlayerSocketId = userSocketMapping[otherPlayerId];
            
            if (otherPlayerSocketId) {
              const otherPlayerSocket = io.sockets.sockets.get(otherPlayerSocketId);
              if (otherPlayerSocket) {
                otherPlayerSocket.emit('opponentDisconnected', { 
                  matchId,
                  message: 'Your opponent has disconnected. You win by default!'
                });
              }
            }
            
            // Clear any pending question timeouts
            if (questionTimeouts[matchId]) {
              clearTimeout(questionTimeouts[matchId]);
              delete questionTimeouts[matchId];
            }
            
            // End the match
            endMatch(match, io, otherPlayerId); // The remaining player wins
            
            // Delete match from active matches
            delete activeMatches[matchId];
          }
        }
      }
    });

    // Keep-alive ping to prevent socket disconnections
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Re-join match if connection was temporarily lost
    socket.on('rejoinMatch', (data: { userId: string, battleId: string }) => {
      if (!data.userId || !data.battleId) return;
      
      const match = activeMatches[data.battleId];
      if (!match) {
        socket.emit('matchNotFound');
        return;
      }
      
      // Update socket mapping
      userSocketMapping[data.userId] = socket.id;
      
      // Resend current match state
      const currentQuestion = match.questions[match.currentQuestionIndex];
      socket.emit('rejoinSuccess', {
        currentQuestionIndex: match.currentQuestionIndex,
        question: {
          question: currentQuestion.question,
          options: currentQuestion.options,
          startTime: Date.now() - 5000 // Give a bit of time to catch up
        },
        myScore: match.scores[data.userId] || 0,
        opponentId: data.userId === match.player1 ? match.player2 : match.player1,
        opponentScore: match.scores[data.userId === match.player1 ? match.player2 : match.player1] || 0
      });
    });
  });

  function matchPlayers(io: Server) {
    console.log('Attempting to match players...');
    
    if (matchmakingQueue.length < 2) return;
    
    // For now, simple match with first 2 players in queue
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();
    
    if (!player1 || !player2) return;
    
    console.log(`Players matched: ${player1.userId} vs ${player2.userId}`);
    
    const matchId = generateMatchId();
    const questions = selectQuestions();
    console.log('Generated questions:', questions);
    
    // Create match
    const match: BattleMatch = {
      quizId: matchId,
      player1: player1.userId,
      player2: player2.userId,
      socketMap: { 
        [player1.userId]: player1.socketId, 
        [player2.userId]: player2.socketId 
      },
      currentQuestionIndex: -1,
      questions,
      answers: {},
      scores: { [player1.userId]: 0, [player2.userId]: 0 },
      maxQuestions: questions.length
    };
    
    activeMatches[matchId] = match;
    
    // Notify both players of the match
    io.to(player1.socketId).to(player2.socketId).emit('matchFound', {
      quizId: matchId,
      player1: player1.userId,
      player2: player2.userId
    });
    
    // Send first question after a delay
    setTimeout(() => {
      sendNextQuestion(match, io);
    }, 5000); // Wait 5 seconds before starting questions
  }

  function sendNextQuestion(match: BattleMatch, io: Server) {
    // Clear any existing timeout first
    if (questionTimeouts[match.quizId]) {
      clearTimeout(questionTimeouts[match.quizId]);
      delete questionTimeouts[match.quizId];
    }
    
    match.currentQuestionIndex++;
    match.answers = {}; // Reset answers for new question
    
    if (match.currentQuestionIndex >= match.maxQuestions) {
      // All questions have been asked, end the match
      endMatch(match, io);
      return;
    }
    
    const currentQuestion = match.questions[match.currentQuestionIndex];
    const startTime = Date.now();
    const questionData = {
      question: currentQuestion.question,
      options: currentQuestion.options,
      startTime: startTime,
      questionIndex: match.currentQuestionIndex // Add question index for tracking
    };
    
    console.log(`Sending question ${match.currentQuestionIndex + 1}/${match.maxQuestions} to match ${match.quizId}`);
    
    // Emit to both players simultaneously using their socket IDs
    const socket1Id = userSocketMapping[match.player1];
    const socket2Id = userSocketMapping[match.player2];
    
    if (socket1Id) {
      const socket1 = io.sockets.sockets.get(socket1Id);
      if (socket1) socket1.emit('nextQuestion', questionData);
    }
    
    if (socket2Id) {
      const socket2 = io.sockets.sockets.get(socket2Id);
      if (socket2) socket2.emit('nextQuestion', questionData);
    }
    
    // Set timeout to move to next question if no answers (slightly longer than client timer)
    questionTimeouts[match.quizId] = setTimeout(() => {
      console.log(`Question timeout reached for match ${match.quizId}`);
      processAnswers(match, io);
    }, 32000); // 32 seconds (30 second timer + 2 second buffer)
  }

  function checkBothAnswered(match: BattleMatch, io: Server) {
    // If both players have answered
    if (match.answers[match.player1] && match.answers[match.player2]) {
      // Clear the timeout since both players answered
      if (questionTimeouts[match.quizId]) {
        clearTimeout(questionTimeouts[match.quizId]);
        delete questionTimeouts[match.quizId];
      }
      
      processAnswers(match, io);
    }
    // Otherwise wait for other player or timeout
  }

  function processAnswers(match: BattleMatch, io: Server) {
    const currentQuestion = match.questions[match.currentQuestionIndex];
    
    // Fill in default answers for players who didn't answer
    if (!match.answers[match.player1]) {
      match.answers[match.player1] = {
        answer: "",
        isCorrect: false
      };
    }
    
    if (!match.answers[match.player2]) {
      match.answers[match.player2] = {
        answer: "",
        isCorrect: false
      };
    }
    
    const player1Answer = match.answers[match.player1];
    const player2Answer = match.answers[match.player2];
    
    // Send score updates to players - NOTE: Ensure each player only gets their own results
    const socket1 = io.sockets.sockets.get(userSocketMapping[match.player1]);
    const socket2 = io.sockets.sockets.get(userSocketMapping[match.player2]);
    
    // Make sure to only send one update per question to avoid duplicate results
    if (socket1) {
      socket1.emit('updateScore', {
        userId: match.player1,
        newScore: match.scores[match.player1] || 0,
        lastAnswerCorrect: player1Answer.isCorrect,
        lastAnswer: player1Answer.answer,
        correctAnswer: currentQuestion.correctAnswer,
        questionIndex: match.currentQuestionIndex,
        // Send opponent info too
        opponentInfo: {
          userId: match.player2,
          answer: player2Answer.answer,
          correct: player2Answer.isCorrect,
          score: match.scores[match.player2] || 0
        }
      });
    }
    
    if (socket2) {
      socket2.emit('updateScore', {
        userId: match.player2,
        newScore: match.scores[match.player2] || 0,
        lastAnswerCorrect: player2Answer.isCorrect,
        lastAnswer: player2Answer.answer,
        correctAnswer: currentQuestion.correctAnswer,
        questionIndex: match.currentQuestionIndex,
        // Send opponent info too
        opponentInfo: {
          userId: match.player1,
          answer: player1Answer.answer,
          correct: player1Answer.isCorrect,
          score: match.scores[match.player1] || 0
        }
      });
    }
    
    // Wait before sending the next question
    setTimeout(() => {
      sendNextQuestion(match, io);
    }, 3000); // 3 second feedback period
  }

  function endMatch(match: BattleMatch, io: Server, defaultWinnerId?: string) {
    // Determine winner based on scores
    let player1Score = match.scores[match.player1] || 0;
    let player2Score = match.scores[match.player2] || 0;
    let winner = null;
    
    // If there's a default winner (due to disconnect)
    if (defaultWinnerId) {
      winner = defaultWinnerId;
      if (defaultWinnerId === match.player1) {
        player1Score = 999; // Ensure they win
        player2Score = 0;
      } else {
        player1Score = 0;
        player2Score = 999;
      }
    } else {
      // Normal winner determination
      if (player1Score > player2Score) {
        winner = match.player1;
      } else if (player2Score > player1Score) {
        winner = match.player2;
      } 
      // If tied, winner remains null
    }
    
    const results = [
      { 
        userId: match.player1, 
        score: player1Score,
        isWinner: winner === match.player1,
        reason: defaultWinnerId && defaultWinnerId !== match.player1 ? 'disconnected' : undefined
      },
      { 
        userId: match.player2, 
        score: player2Score,
        isWinner: winner === match.player2,
        reason: defaultWinnerId && defaultWinnerId !== match.player2 ? 'disconnected' : undefined
      }
    ];
    
    // Send match over event to both players
    const socket1 = io.sockets.sockets.get(userSocketMapping[match.player1]);
    const socket2 = io.sockets.sockets.get(userSocketMapping[match.player2]);
    
    console.log(`Match ${match.quizId} ended. Results:`, results);
    
    if (socket1) socket1.emit('matchOver', { results });
    if (socket2) socket2.emit('matchOver', { results });
    
    // Clean up
    if (questionTimeouts[match.quizId]) {
      clearTimeout(questionTimeouts[match.quizId]);
      delete questionTimeouts[match.quizId];
    }
    
    delete activeMatches[match.quizId];
  }
}
