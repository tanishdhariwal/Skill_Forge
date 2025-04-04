import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { createStudyPlan, generateStudyPlan, getStudyPlan, getPlans } from "../controllers/roadmapController.js";


const studyPlanRoutes = Router();


studyPlanRoutes.post("/studyPlan", verifyToken, createStudyPlan);
studyPlanRoutes.get("/plantiles", verifyToken, getPlans);
studyPlanRoutes.get("/getPlan/:id", verifyToken, getStudyPlan);
studyPlanRoutes.post("/generateStudyPlan", verifyToken, generateStudyPlan);

export default studyPlanRoutes;