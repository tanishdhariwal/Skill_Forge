import { Server } from "socket.io";
import mongoose from "mongoose";

interface MatchRequest {
  userId: string;
  quizRating: number;
}

interface Match {
  player1: string;
  player2: string;
  quizId: string;
}

const matchmakingQueue: MatchRequest[] = [];
const activeMatches: Match[] = [];

export function setupMatchmaking(io: Server) {
  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("joinQueue", async ({ userId, quizRating }: MatchRequest) => {
      matchmakingQueue.push({ userId, quizRating });
      attemptMatch(io);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  });
}

function attemptMatch(io: Server) {
  if (matchmakingQueue.length >= 2) {
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.find(
      (p) => Math.abs(p.quizRating - (player1?.quizRating || 0)) <= 100
    );

    if (player1 && player2) {
      matchmakingQueue.splice(matchmakingQueue.indexOf(player2), 1);

      const match: Match = {
        player1: player1.userId,
        player2: player2.userId,
        quizId: new mongoose.Types.ObjectId().toString(),
      };

      activeMatches.push(match);
      io.to(player1.userId).emit("matchFound", match);
      io.to(player2.userId).emit("matchFound", match);
    }
  }
}
