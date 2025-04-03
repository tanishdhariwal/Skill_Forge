// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDB } from './config/db';
import curriculumRoutes from './routes/curriculumRoutes';
import mockInterviewRoutes from './routes/mockInterviewRoutes';
import quizRoutes from './routes/quizRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectToDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/roadmaps', roadmapRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
