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
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({origin:true,credentials:true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/v1/user', userRouter);
// app.use('/api/curriculum', curriculumRoutes);
app.use('/api/v1/interview', interviewRouter);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/studyplan', studyPlanRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
