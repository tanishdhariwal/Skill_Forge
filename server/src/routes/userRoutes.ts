import { Router } from "express";
import {   userSignup,
    userLogin,
    verifyUser,
    userLogout, 
    uploadResume,
    addDailyActivity,
    getDailyActivity,
    updateDailyActivity, updatePassword,
    streakUpdate,
    getDashboardData,
    addExp,
    getProfile,
    createBadge,
    getUserBadges,
    getAllBadges,
    addBadge,
    incrementInterviewCompleted,
    incrementCountQuizCompleted} from "../controllers/user-controllers.js";
import {
  loginValidator,
  registerValidator,
  validate,
} from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
import upload from "../utils/upload.js";

const userRoutes = Router();

userRoutes.post("/signup", userSignup);
userRoutes.post("/login", userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);
userRoutes.post("/upload-resume", verifyToken, upload.single("resume"), uploadResume); 
userRoutes.post("/daily-activity", verifyToken, addDailyActivity);
userRoutes.get("/daily-activity", verifyToken, getDailyActivity);
userRoutes.put("/daily-activity", verifyToken, updateDailyActivity);
userRoutes.get("/updateStreak", verifyToken, streakUpdate);
userRoutes.post("/updatePassword", verifyToken, updatePassword);
userRoutes.get("/dashboard", verifyToken, getDashboardData);
userRoutes.get("/profile", verifyToken, getProfile);
userRoutes.put("/addExp", verifyToken, addExp);
userRoutes.post("/createBadge", verifyToken, createBadge);
userRoutes.get("/Badge", verifyToken, getUserBadges);
userRoutes.get("/getAllBadges", verifyToken, getAllBadges);
userRoutes.get("/checkBadges",verifyToken, addBadge);
userRoutes.put("/incrementInterviewCompleted", verifyToken, incrementInterviewCompleted);
userRoutes.put("/incrementQuizCompleted", verifyToken, incrementCountQuizCompleted);
export default userRoutes;