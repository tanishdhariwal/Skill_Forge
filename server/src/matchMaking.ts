import { Server } from "socket.io";
import mongoose from "mongoose";
import { GenMcqQuestions } from "./Api-helper/helper.js"; 

interface MatchRequest {
  userId: string;
  quizRating: number;
}


const matchmakingQueue: MatchRequest[] = [];
const activeMatches: any[] = [];


// Store user socket connections
const userSockets: Map<string, string> = new Map();

export function setupMatchmaking(io: Server) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinQueue", (data: MatchRequest) => {
      userSockets.set(data.userId, socket.id);
      console.log(`User joined queue: ${data.userId}`);
      matchmakingQueue.push(data);
      attemptMatch(io);
    });

    socket.on("submitAnswer", (data) => handleAnswer(io, socket, data));

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Remove user from queues if they disconnect
      for (let i = 0; i < matchmakingQueue.length; i++) {
        if (userSockets.get(matchmakingQueue[i].userId) === socket.id) {
          console.log(`Removing ${matchmakingQueue[i].userId} from matchmaking queue`);
          matchmakingQueue.splice(i, 1);
          break;
        }
      }
      socket.on("matchFound", async (match) => {
        console.log(`Starting match: ${match.player1} vs ${match.player2}`);
  
        // Generate questions for the match
        const questions = await GenMcqQuestions();

        console.log(`Generated questions: ${questions}`);
        // Store match session
        const battleId = new mongoose.Types.ObjectId().toString();
        
        activeMatches.push({
          battleId,
          players: [
            { userId: match.player1, socketId: userSockets.get(match.player1), score: 0, currentQuestion: 0 },
            { userId: match.player2, socketId: userSockets.get(match.player2), score: 0, currentQuestion: 0 }
          ],
          questions
        });
  
        // Send first question to both players
        activeMatches.forEach((m) => {
          if (m.battleId === battleId) {
            m.players.forEach((p) => {
              io.to(p.socketId).emit("nextQuestion", {
                battleId,
                question: questions[0].question,
                options: questions[0].options
              });
            });
          }
        });
      });


      // Remove user socket mapping
      userSockets.forEach((value, key) => {
        if (value === socket.id) {
          console.log(`Removing user socket mapping for ${key}`);
          userSockets.delete(key);
        }
      });
    });
  });
}

// function attemptMatch(io: Server) {
//   console.log("Attempting to match players...");
//   if (matchmakingQueue.length >= 2) {
//     const player1 = matchmakingQueue.shift();
//     const player2 = matchmakingQueue.find(
//       (p) => Math.abs(p.quizRating - (player1?.quizRating || 0)) <= 100
//     );

//     if (player1 && player2) {
//       matchmakingQueue.splice(matchmakingQueue.indexOf(player2), 1);

//       const match = {
//         player1: player1.userId,
//         player2: player2.userId,
//         quizId: new mongoose.Types.ObjectId().toString(),
//       };

//       console.log(`Players matched: ${player1.userId} vs ${player2.userId}`);

//       activeMatches.push(match);

//       // Get socket IDs
//       const player1Socket = userSockets.get(player1.userId);
//       const player2Socket = userSockets.get(player2.userId);
//       console.log(`Player 1 socket: ${player1Socket}, Player 2 socket: ${player2Socket}`);

//       if (player1Socket) io.to(player1Socket).emit("matchFound", match);
//       if (player2Socket) io.to(player2Socket).emit("matchFound", match);
//     }

//     // await startQuizBattle(io, player1, player2);
//   }
// }



async function attemptMatch(io: Server) {
  console.log("Attempting to match players...");
  if (matchmakingQueue.length >= 2) {
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.find(
      (p) => Math.abs(p.quizRating - (player1?.quizRating || 0)) <= 100
    );

    if (player1 && player2) {
      matchmakingQueue.splice(matchmakingQueue.indexOf(player2), 1);

      const battleId = new mongoose.Types.ObjectId().toString();
      const questions = await GenMcqQuestions();

      const match = {
        player1: player1.userId,
        player2: player2.userId,
        quizId: battleId,
      };

      console.log(`Players matched: ${player1.userId} vs ${player2.userId}`);
      console.log(`Generated questions:`, questions);

      const player1Socket = userSockets.get(player1.userId);
      const player2Socket = userSockets.get(player2.userId);

      activeMatches.push({
        battleId,
        players: [
          { userId: player1.userId, socketId: player1Socket, score: 0, currentQuestion: 0 },
          { userId: player2.userId, socketId: player2Socket, score: 0, currentQuestion: 0 }
        ],
        questions
      });

      // Emit "matchFound" to both clients
      if (player1Socket) io.to(player1Socket).emit("matchFound", match);
      if (player2Socket) io.to(player2Socket).emit("matchFound", match);

      // Emit first question to both
      const firstQuestion = questions[0];
      if (player1Socket) {
        io.to(player1Socket).emit("nextQuestion", {
          battleId,
          question: firstQuestion.question,
          options: firstQuestion.options
        });
      }
      if (player2Socket) {
        io.to(player2Socket).emit("nextQuestion", {
          battleId,
          question: firstQuestion.question,
          options: firstQuestion.options
        });
      }
    }
  }
}


function handleAnswer(io: Server, socket: any, data: { battleId: string; userId: string; answer: string }) {
  console.log(`Received answer from ${data.userId}: ${data.answer}`);
  // Find the match using battleId
  console.log(`Searching for match with battleId: ${data.battleId}`);
  console.log(`Active matches: ${JSON.stringify(activeMatches)}`);
  const match = activeMatches.find((m) => m.battleId === data.battleId);
  console.log(`Match found: ${match}`);
  if (!match) return;

  console.log(`Active players`, match.players);
  const player = match.players.find((p) => p.userId === data.userId);

  console.log(`Player found: ${player}`);
  if (!player) return;
  console.log(`Player ${player.userId} answered: ${data.answer}`);

  const questionIndex = player.currentQuestion;
  const question = match.questions[questionIndex];

  // Validate answer
  const isCorrect = data.answer === question.correctAnswer;
  if (isCorrect) player.score++;

  console.log(`Player ${player.userId} answered Q${questionIndex}: ${isCorrect ? "Correct" : "Wrong"}`);

  // Move to the next question
  player.currentQuestion++;

  // Notify both players of the progress
  match.players.forEach((p) => {
    io.to(p.socketId).emit("updateScore", {
      userId: player.userId,
      newScore: player.score,
      questionIndex,
      correct: isCorrect,
    });
  });

  // Check if both players have answered
  const allAnswered = match.players.every((p) => p.currentQuestion > questionIndex);

  if (allAnswered) {
    if (questionIndex + 1 < match.questions.length) {
      // Send next question
      match.players.forEach((p) => {
        io.to(p.socketId).emit("nextQuestion", {
          battleId: match.battleId,
          question: match.questions[questionIndex + 1].question,
          options: match.questions[questionIndex + 1].options,
        });
      });
    } else {
      // Game Over - Send final results
      match.players.forEach((p) => {
        io.to(p.socketId).emit("matchOver", {
          battleId: match.battleId,
          results: match.players.map((pl) => ({
            userId: pl.userId,
            score: pl.score,
          })),
        });
      });

      // Remove match from activeMatches
      activeMatches.splice(activeMatches.indexOf(match), 1);
    }
  }
}
