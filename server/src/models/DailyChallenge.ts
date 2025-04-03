import mongoose from "mongoose";

//list of question references to MCQSchema

const dailyChallengeSchema = new mongoose.Schema({
    challenges:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MCQuestion"
        }
    ]
}, { timestamps: true });

export const DailyChallenge = mongoose.model("DailyChallenge", dailyChallengeSchema);
