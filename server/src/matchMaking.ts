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

function attemptMatch(io: Server) {
  console.log("Attempting to match players...");
  if (matchmakingQueue.length >= 2) {
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.find(
      (p) => Math.abs(p.quizRating - (player1?.quizRating || 0)) <= 100
    );

    if (player1 && player2) {
      matchmakingQueue.splice(matchmakingQueue.indexOf(player2), 1);

      const match = {
        player1: player1.userId,
        player2: player2.userId,
        quizId: new mongoose.Types.ObjectId().toString(),
      };

      console.log(`Players matched: ${player1.userId} vs ${player2.userId}`);

      activeMatches.push(match);

      // Get socket IDs
      const player1Socket = userSockets.get(player1.userId);
      const player2Socket = userSockets.get(player2.userId);
      console.log(`Player 1 socket: ${player1Socket}, Player 2 socket: ${player2Socket}`);

      if (player1Socket) io.to(player1Socket).emit("matchFound", match);
      if (player2Socket) io.to(player2Socket).emit("matchFound", match);
    }

    // await startQuizBattle(io, player1, player2);
  }
}

