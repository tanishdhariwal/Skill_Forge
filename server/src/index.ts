// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import curriculumRoutes from './routes/curriculumRoutes';
// import mockInterviewRoutes from './routes/mockInterviewRoutes';
// import quizRoutes from './routes/quizRoutes';
// import roadmapRoutes from './routes/roadmapRoutes';
import userRouter from './routes/userRoutes.js';
// import errorHandler from './middlewares/errorHandler.js';
import { Request, Response } from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import studyPlanRoutes from './routes/roadmapRoutes.js';
import interviewRouter from './routes/mockInterviewRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser(process.env.COOKIE_SECRET));
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({origin:true,credentials:true}));
app.use(express.json());

// Routes
app.use('/api/v1/user', userRouter);
// app.use('/api/curriculum', curriculumRoutes);
app.use('/api/v1/interview', interviewRouter);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/studyplan', studyPlanRoutes);

// Error handling middleware
// app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
