import { Server } from "socket.io";
import mongoose from "mongoose";
import { GenMcqQuestions } from "./Api-helper/helper.js"; 

interface MatchRequest {
  userId: string;
  quizRating: number;
}

interface BattleRequest extends MatchRequest {
  socketId: string;
}

interface BattleSession {
  battleId: string;
  players: { userId: string; socketId: string; currentQuestion: number; score: number }[];
  questions: { question: string; options: string[]; correctAnswer: string }[];
}

const matchmakingQueue: MatchRequest[] = [];
const activeMatches: any[] = [];

// New battle variables
const battleQueue: BattleRequest[] = [];
const battleSessions: BattleSession[] = [];

export function setupMatchmaking(io: Server) {
  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("joinQueue", (data: MatchRequest) => {
        console.log("User joined queue: ", data.userId);
      matchmakingQueue.push(data);
      attemptMatch(io);
    });

    socket.on("joinBattle", (data: BattleRequest) => {
        console.log("User joined battle queue: ", data.userId);
      // Include socketId from the connection
      battleQueue.push({ ...data, socketId: socket.id });
      attemptBattleMatch(io);
    });

    socket.on("submitAnswer", async (data: { battleId: string; answer: string; userId: string }) => {
        console.log("Answer submitted: ", data.answer);
      const battle = battleSessions.find((b) => b.battleId === data.battleId);
      if (!battle) return;
      // Find player index in the battle session
      const player = battle.players.find(p => p.userId === data.userId);
      if (!player) return;
      const question = battle.questions[player.currentQuestion];
      // Update score if answer is correct
      if (data.answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
        player.score += 1;
      }
      player.currentQuestion += 1;
      // Broadcast progress update to both players
      io.to(player.socketId).emit("battleProgress", battle.players);
      battle.players.forEach(p => {
        io.to(p.socketId).emit("battleProgress", battle.players);
      });
    });

    socket.on("disconnect", () => {

      console.log("User disconnected: ", socket.id);
      // Optionally remove from queues if necessary...
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

      const match = {
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

async function attemptBattleMatch(io: Server) {
  if (battleQueue.length >= 2) {
    const battlePlayer1 = battleQueue.shift()!;
    const battlePlayer2 = battleQueue.shift()!;
    const battleId = new mongoose.Types.ObjectId().toString();
    // Get MCQ battle questions (e.g., 6 questions)
    const questions = await GenMcqQuestions();
    const newBattle: BattleSession = {
      battleId,
      players: [
        { userId: battlePlayer1.userId, socketId: battlePlayer1.socketId, currentQuestion: 0, score: 0 },
        { userId: battlePlayer2.userId, socketId: battlePlayer2.socketId, currentQuestion: 0, score: 0 },
      ],
      questions,
    };
    battleSessions.push(newBattle);
    // Emit battle start event to both players with questions (without revealing correct answers)
    [battlePlayer1, battlePlayer2].forEach((p) => {
      io.to(p.socketId).emit("battleStarted", {
        battleId,
        questions: newBattle.questions.map(q => ({ question: q.question, options: q.options })),
        initialProgress: newBattle.players.map(player => ({ userId: player.userId, score: player.score }))
      });
    });
  }
}