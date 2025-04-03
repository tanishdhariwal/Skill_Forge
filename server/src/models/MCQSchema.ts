import mongoose from "mongoose";

const MCQuestionSchema = new mongoose.Schema({
    question: {type: String},
    topic: {type: String},
    options: [{type: String}],
    correctAnswer: String,
    date: String,
  });

const MCQuestionDaily = mongoose.model("MCQuestionDaily", MCQuestionSchema);
const MCQuestion = mongoose.model("MCQuestion", MCQuestionSchema);
export {MCQuestionDaily, MCQuestion};
