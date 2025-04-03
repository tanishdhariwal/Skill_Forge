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
    getDashboardData} from "../controllers/user-controllers.js";
import {
  loginValidator,
  registerValidator,
  validate,
} from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
import upload from "../utils/upload.js";

const userRoutes = Router();

userRoutes.post("/signup", validate(registerValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);
userRoutes.post("/upload-resume", verifyToken, upload.single("resume"), uploadResume); 
userRoutes.post("/daily-activity", verifyToken, addDailyActivity);
userRoutes.get("/daily-activity", verifyToken, getDailyActivity);
userRoutes.put("/daily-activity", verifyToken, updateDailyActivity);
userRoutes.get("/updateStreak", verifyToken, streakUpdate);
userRoutes.post("/updatePassword", verifyToken, updatePassword);
userRoutes.post("/profile", verifyToken, getDashboardData);

export default userRoutes;