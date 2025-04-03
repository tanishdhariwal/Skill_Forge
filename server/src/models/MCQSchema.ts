import mongoose from "mongoose";

const MCQuestionSchema = new mongoose.Schema({
    question: {type: String},
    topic: {type: String},
    options: [{type: String}],
    correctAnswer: String,
    date: String,
  });

module.exports = mongoose.model("MCQuestion", MCQuestionSchema);
