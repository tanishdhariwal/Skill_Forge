import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { createStudyPlan, generateStudyPlan, getStudyPlans } from "../controllers/roadmapController.js";


const studyPlanRoutes = Router();


studyPlanRoutes.post("/studyPlan", verifyToken, createStudyPlan);
studyPlanRoutes.get("/studyPlan", verifyToken, getStudyPlans);
studyPlanRoutes.post("/generateStudyPlan", verifyToken, generateStudyPlan);

export default studyPlanRoutes;