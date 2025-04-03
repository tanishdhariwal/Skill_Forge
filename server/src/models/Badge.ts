import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['streak', 'quiz', 'challenge'], 
        required: true 
    },
    requirement: { type: Number, required: true }, 
    icon: { type: String, default: "" } 
}, { timestamps: true });

export const Badge = mongoose.model("Badge", BadgeSchema);
