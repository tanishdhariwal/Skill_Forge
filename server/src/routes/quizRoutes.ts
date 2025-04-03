import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { getStreakQuestions } from "../controllers/quizController.js";
// import { createStudyPlan, generateStudyPlan, getStudyPlans } from "../controllers/roadmapController.js";


const quizRoutes = Router();

quizRoutes.get("/getStreakQuestions", verifyToken, getStreakQuestions);

export default quizRoutes;