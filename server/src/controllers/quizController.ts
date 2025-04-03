import { config } from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";
import nodeSchedule from "node-schedule";
import { MCQuestion, MCQuestionDaily } from "../models/MCQSchema.js";
config();


const callGroqAI = async (messages: any[],task:string) => {
    try {
      const openai1 = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
      });
        const response = await openai1.chat.completions.create({
            // model: "o3-mini",
            model:"llama-3.3-70b-specdec",
            messages,
            max_tokens: 700,
            temperature: 0.5,
            top_p: 1.0,
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI:", error);
        return "Token limit exceeded";
    }
}



const fetchAndStoreQuestions = async (): Promise<void> => {
    const topics = ["ML", "Programming", "Aptitude", "Web Dev"];
    const subject = "Computer Science";
    const today = new Date().toISOString().split("T")[0];

    try {
        // Delete existing questions for today
        await MCQuestionDaily.deleteMany({ date: today });
        console.log("🗑️ Old questions cleared from database.");

        for (const topic of topics) {
            const messages = [
                {
                    role: "user",
                    content: `You are a professional ${subject} teacher.\nGenerate exactly 1 multiple-choice question (MCQ) for ${topic} within ${subject}.\nFormat:\n[\n    {\n        "question": "What is ...?",\n        "options": ["option 1", "option 2", "option 3", "option 4"],\n        "correctAnswer": "correct option"\n    }\n]\nReturn ONLY a valid JSON array with NO extra text.`
                }
            ];
            
            const responseString: string = await callGroqAI(messages, "Generate MCQ");
            
            try {
                const quizArray: { question: string; options: string[]; correctAnswer: string }[] = JSON.parse(responseString);
                
                if (Array.isArray(quizArray) && quizArray.length === 1) {
                    const q = quizArray[0];
                    const newQuestion = new MCQuestionDaily({
                        topic,
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        date: today,
                    });
                    await newQuestion.save();
                    console.log(`✅ Successfully stored question for ${topic}.`);
                } else {
                    console.error(`❌ Invalid response format for ${topic}`);
                }
            } catch (err) {
                console.error(`❌ Error parsing response for ${topic}:`, err);
            }
        }
    } catch (error) {
        console.error("❌ API Request Error:", error);
    }
};

// Schedule job to run every day at midnight
nodeSchedule.scheduleJob("0 0 * * *", fetchAndStoreQuestions);

export const getStreakQuestions = async (req: any, res: any): Promise<void> => {
    const today = new Date().toISOString().split("T")[0];
    const questions = await MCQuestionDaily.find({ date: today });

    if (questions.length === 0) {
        await fetchAndStoreQuestions();
        res.json({ message: "Fetching new questions..." });
        return;
    }

    res.json(questions);
};
