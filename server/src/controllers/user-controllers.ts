import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/token-manager.js";
import { Hashing } from "../utils/hash.js";
import { User } from "../models/User.js";
import multer from "multer";
import path from "path";
import mammoth from "mammoth";
import fs from "fs";
import upload from "../utils/upload.js";
// console.log("process.env.COOKIE_NAME", process.env.COOKIE_NAME);
import { COOKIE_NAME } from "../utils/constant.js"; 
import { Interview } from "../models/Interview.js";
import { StudyPlan } from "../models/StudyPlan.js";
import { Badge } from "../models/Badge.js";
const compare = bcrypt.compare;

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {username, name, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(401).send("User already registered");
    const hashedPassword = await Hashing(password);
    const user = new User({ username, name, email, password: hashedPassword });
    await user.save();

    // create token and store cookie
    // res.clearCookie(COOKIE_NAME, {
    //   httpOnly: true,
    // // domain: process.env.FRONTEND_URL,
    // signed: true,
    // path: "/",
    // });

    // const token = createToken(user.username, "user", "7d");
    // const expires = new Date();
    // expires.setDate(expires.getDate() + 7);
    // res.cookie(COOKIE_NAME, token, {
    //   httpOnly: true,
    //   signed: true,
    //   secure: true,
    //   maxAge: 3600000,
    //   path: "/",
    // });

    return res
      .status(201)
      .json({ message: "OK", name: user.username });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("User not registered");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password");
    }


    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      // domain: process.env.FRONTEND_URL,
      signed: true,
      path: "/",
    });

    const token = createToken(user.username, "user", "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    console.log(COOKIE_NAME);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
      secure: true,
      maxAge: 3600000,
      path: "/",
    });

    return res
      .status(200)
      .json({ message: "OK", name: user.username});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = res.locals.jwtData.username;
    const user = await User.findOne({"username":username}).select("-password");
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user.username !== res.locals.jwtData.username) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", name: user.username });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findOne({"username":res.locals.jwtData.username});
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user.username !== res.locals.jwtData.username) {
      return res.status(401).send("Permissions didn't match");
    }

    res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    // domain: process.env.FRONTEND_URL,
    signed: true,
    path: "/",
    });

    return res
      .status(200)
      .json({ message: "OK", name: user.username});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};


export const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username  = res.locals.jwtData.username; 
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log(username);
    const user = await User.findOne({ "username": username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resume) {
      fs.unlinkSync(user.resume);
    }

    user.resume = req.file.path;
    await user.save();

    return res.status(200).json({ message: "Resume uploaded", file: req.file.path });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};






export const addDailyActivity = async (req: Request, res: Response) => {
  try {
    const  username  = res.locals.jwtData.username;
    const { date, activities } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.daysAttended.push({ date, activities });
    await user.save();
    
    return res.status(201).json({ message: "Daily activity added", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", cause: error.message });
  }
};

export const getDailyActivity = async (req, res) => {
  try {
    const  username  = res.locals.jwtData.username;
    const user = await User.findOne({ username }).select("daysAttended");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ daysAttended: user.daysAttended });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", cause: error.message });
  }
};

export const updateDailyActivity = async (req, res) => {
  try {
    const  username  = res.locals.jwtData.username;
    const { date, activities } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activityIndex = user.daysAttended.findIndex(activity => activity.date.toISOString().split('T')[0] === date);
    if (activityIndex === -1) {
      return res.status(404).json({ message: "Activity not found for this date" });
    }

    user.daysAttended[activityIndex].activities = activities;
    await user.save();
    
    return res.status(200).json({ message: "Daily activity updated", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", cause: error.message });
  }
};
;

export const streakUpdate = async (req: Request, res: Response) => {
  try {
    const username = res.locals.jwtData.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = new Date(user.streak.lastDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 1) {
      user.streak.score += 1;
    } else if (diffInDays > 1) {
      user.streak.score = 1;
    }

    user.streak.lastDate = today;

    if (!user.longestStreak || user.streak.score > user.longestStreak) {
      user.longestStreak = user.streak.score;
    }

    await user.save();
    return res.status(200).json({ message: 'Streak updated successfully', streak: user.streak, longestStreak: user.longestStreak });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', cause: error.message });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const username = res.locals.jwtData.username;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: 'Incorrect password' });
    }

    user.password = await Hashing(newPassword);
    await user.save();
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', cause: error.message });
  }
};


export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const username = res.locals.jwtData.username; // Assuming user ID is available in request
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

      // Fetch user's interview history
      const interviews = await Interview.find({ userRef: user._id }).sort({ createdAt: -1 }).lean();
      const interviewHistory = interviews.map(interview => ({
          id: interview._id,
          title: interview.title,
          date: interview.createdAt.toISOString().split("T")[0],
          score: interview.score,
          status: interview.status,
      }));

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const streakCalendar = user.daysAttended.map(day => ({
          date: day.date.toISOString().split("T")[0],
          completed: day.activities.some(activity => activity.type === "streak"),
      }));

      const streakData = {
          currentStreak: user.streak.score,
          longestStreak: user.longestStreak,
          thisMonth: streakCalendar.filter(day => new Date(day.date).getMonth() === new Date().getMonth()).length,
          lastMonth: streakCalendar.filter(day => new Date(day.date).getMonth() === new Date().getMonth() - 1).length,
          streakCalendar,
      };
      const userdata = {
          username: user.username,
          level: user.level,
          exp: user.exp
      }

      return res.json({ userdata,interviewHistory, streakData });
  } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const addExp = async (req: Request, res: Response) => {
  try {
      const username = res.locals.jwtData.username;
      // const { exp } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      user.exp += 10;
      if(user.exp >= 100) {
          user.level += 1;
          user.exp = 0;
      }
      await user.save();
      return res.status(200).json({ message: 'Exp added successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', cause: error.message });
  }
};


export const getProfile = async (req: Request, res: Response) => {
  try {
    const username = res.locals.jwtData.username; // Required authentication
    
    const user = await User.findOne({ username })
        .populate('badges', 'name description type icon') // Ensure Badge schema is imported
        .populate('studyPlans', 'title')
        .populate('interviews', '_id');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Calculate study plan progress
    const studyPlansWithProgress = await StudyPlan.find({ author: user._id })
        .populate({
            path: 'nodes',
            select: 'progress'
        });

    const studyPlans = studyPlansWithProgress.map(sp => ({
        title: sp.title,
        progress: sp.nodes.length > 0 ? 
            (sp.nodes.reduce((sum, node:any) => sum + node.progress, 0) / sp.nodes.length) : 0
    }));

    res.json({
        username: user.username,
        level: user.level,
        exp: user.exp,
        interviewCount: user.interviews.length,
        studyPlanCount: user.studyPlans.length,
        streak: user.streak.score,
        longestStreak: user.longestStreak,
        badges: user.badges,
        studyPlans
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
}
};


export const createBadge = async (req: Request, res: Response) => {
  try {
    const { name, description, type, requirement, icon } = req.body;
    const badge = new Badge({ name, description, type, requirement, icon });
    await badge.save();
    res.status(201).json(badge);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

export const getUserBadges = async (req: Request, res: Response) => {
  try {
      const username = res.locals.jwtData.username;
      const user = await User.findOne({ username }).populate('badges');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ badges: user.badges });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', cause: error.message });
  }
};

export const getAllBadges = async (req: Request, res: Response) => {
  try {
      const badges = await Badge.find();
      return res.status(200).json({ badges });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', cause: error.message });
  }
};

export const addBadge = async (req: Request, res: Response) => {
  try {
    const username = res.locals.jwtData.username;
    const userId = (await User.findOne({ username }))._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const badges = await Badge.find();
    let newBadges: any[] = [];
    
    for (const badge of badges) {
        let meetsRequirement = false;
        
        if (badge.type === "streak" && user.streak.score >= badge.requirement) meetsRequirement = true;
        if (badge.type === "quiz" && user.quizzesCompleted >= badge.requirement) meetsRequirement = true;
        if (badge.type === "challenge" && user.challengesCompleted >= badge.requirement) meetsRequirement = true;
        
        if (meetsRequirement && !user.badges.includes(badge._id)) {
            user.badges.push(badge._id);
            newBadges.push(badge);
        }
    }
    
    await user.save();
    res.status(200).json({ newBadges });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};