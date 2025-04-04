import { Router } from "express";
import { verifyTokenUser } from "../utils/token-manager.js";
import { startInterview, genrateNextQuestion, submitInterview, resumeInterview, getAllInterviews, getInterviewData } from "../controllers/mockInterviewController.js";

const interviewRouter = Router();

interviewRouter.post("/start_interview", verifyTokenUser,startInterview);
interviewRouter.post("/next/:interview_id", verifyTokenUser,genrateNextQuestion);
interviewRouter.post("/submit/:interview_id", verifyTokenUser,submitInterview);
interviewRouter.get("/resume/:interview_id", verifyTokenUser,resumeInterview);
interviewRouter.get("/all", verifyTokenUser,getAllInterviews);
interviewRouter.get("/:id", verifyTokenUser,getInterviewData);

export default interviewRouter;