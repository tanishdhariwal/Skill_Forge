// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import { Request, Response } from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import studyPlanRoutes from './routes/roadmapRoutes.js';
import interviewRouter from './routes/mockInterviewRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupMatchmaking } from './matchMaking.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/v1/user', userRouter);
// app.use('/api/curriculum', curriculumRoutes);
app.use('/api/v1/interview', interviewRouter);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/studyplan', studyPlanRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Create HTTP server and initialize Socket.IO
const server = createServer(app);
const io = new Server(server, { cors: { origin: true, credentials: true } });
setupMatchmaking(io);

server.listen(5000, "0.0.0.0", () => {
  console.log(`Server running on port 4000`);
});
