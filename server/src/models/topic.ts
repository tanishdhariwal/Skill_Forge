import mongoose from "mongoose";

const topic = new mongoose.Schema({
    subject: { type: String, required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
});

export {topic};
