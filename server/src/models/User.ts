import mongoose from "mongoose";

import { Schema } from "mongoose";

const DailyActivitySchema = new Schema({
    date: { type: Date, required: true },
    activities: [
      {
        type: { type: String, enum: ['study_progress', 'interview', 'streak'], required: true },
        studyPlan: { type: Schema.Types.ObjectId, ref: 'StudyPlan' }, 
        studyNode: { type: Schema.Types.ObjectId, ref: 'StudyPlanNode' },
        interview: { type: Schema.Types.ObjectId, ref: 'Interview' },
      }
    ]
  }, { timestamps: true });



const userSchema = new Schema({
    username:
    {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 1,
        required: true
    },
    exp: {
        type: Number,
        default: 0,
        required: true
    },
    
    resume: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    daysAttended: [DailyActivitySchema],
    streak: {  
        score: {type: Number, default: 1}, 
        
        lastDate: {type: Date, default: Date.now}
    },
    longestStreak: {type: Number, default: 0},
    badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
    studyPlans: [{ type: Schema.Types.ObjectId, ref: 'StudyPlan' }],
    interviews: [{ type: Schema.Types.ObjectId, ref: 'Interview' }],

    quizRating:{
        type:Number,
        default: 0
    },

    interviewRating:{
        type:Number,
        default: 0
    },
    quizzesCompleted: { type: Number, default: 0 },
    interviewCompleted: { type: Number, default: 0 }

}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export { User };