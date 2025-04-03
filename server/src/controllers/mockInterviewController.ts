import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Interview } from "../models/Interview.js";
import { generateQuestion,getFinalFeedback , genNextQuestion, getFeedback} from "../Api-helper/helper.js";


export const startInterview = async (req: Request, res: Response) => {
  try {
    const { title, jobDescription, jobRole, experience } = req.body;
    const username = res.locals.jwtData.username;
    const user = User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const resume = "Basic resume data"; // Placeholder for resume data
    
    const question = generateQuestion(jobDescription, jobRole, experience, resume);
    const interview = new Interview({
        title,
        jobDescription,
        jobRole,
        resumeData: resume,
        experience,
        userRef: (await user)._id,
        exchanges: [{question: {questionText: question}}]
    });
    // interview.exchanges.push({questionText: {question}});
    await interview.save();
    const exchanges = interview.exchanges
    const id = interview._id;
    return res.status(200).json({ message: "OK",exchanges , title ,id});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const genrateNextQuestion = async (req: Request, res: Response) => {
    try {
    const id = req.params.interview_id;
    const { answer } = req.body;
    const username = res.locals.jwtData.username;
    const user = await User.findOne({ username });
    const interview = await Interview.findOne({_id: id,userRef: user._id});
    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }
    const lastExchange = interview.exchanges[interview.exchanges.length - 1];
    lastExchange.answer = answer;
    const { feedback, marks } =await getFeedback(lastExchange);
    lastExchange.exchangeFeedback = feedback;
    lastExchange.marks = marks;
    const { jobDescribtion, jobRole, experience, resumeData } = interview;
    const question = genNextQuestion(interview.exchanges, jobDescribtion, jobRole, experience, resumeData);
    interview.exchanges.push({question: {questionText: question}});
    await interview.save();
    const exchanges = interview.exchanges
    const title = interview.title;
    return res.status(200).json({ message: "OK",exchanges , title ,id});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const submitInterview = async (req: Request, res: Response) => {
    try {
            const id = req.params.interview_id;
            const { answer } = req.body;
            const username = res.locals.jwtData.username;
            const user =  await User.findOne({ username });
            if(!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const interview = await Interview.findOne({_id:id,userRef:user._id});
            if (!interview) {
                return res.status(404).json({ message: "Interview not found" });
            }
            const lastExchange = interview.exchanges[interview.exchanges.length - 1];
            lastExchange.answer = answer;
            const { feedback, marks } =await getFeedback(lastExchange);
            lastExchange.exchangeFeedback = feedback;
            lastExchange.marks = marks;
            const { jobDescribtion, jobRole, experience, resumeData } = interview;
            const interviewfeedback =await getFinalFeedback(jobDescribtion, jobRole, resumeData,interview.exchanges);
            interview.interviewfeedback = interviewfeedback;
            interview.status = "complete";
            await interview.save();
            return res.status(200).json({ message: "OK",interview_id:id});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const resumeInterview = async (req: Request, res: Response) => {
    try {
        const interview_id = req.params.interview_id;
        const username = res.locals.jwtData.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const interview = await Interview.findOne({interview_id,userRef: user._id});
        if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
        }
        const {exchanges, title} = interview;
        return res.status(200).json({ message: "OK",exchanges , title ,interview_id});
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllInterviews = async (req: Request, res: Response) => {
    try {
        const username = res.locals.jwtData.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const interviews = await Interview.find({userRef: user._id});
        return res.status(200).json({ message: "OK", interviews });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getInterviewData = async (req: Request, res: Response) => {
    try {
        const interview_id = req.params.interview_id;
        const username = res.locals.jwtData.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const interview = await Interview.findOne({interview_id,userRef: user._id});
        if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
        }
        return res.status(200).json({ message: "OK",interview});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}