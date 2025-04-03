import express, { Request, Response } from 'express';
import { StudyPlan, StudyPlanNode } from '../models/StudyPlan.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';
import { generateStudyPlanAI } from '../Api-helper/helper.js';

export const createStudyPlan = async (req: Request, res: Response) => {
    try{
        const username = res.locals.jwtData.username;
        const user =  await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const { title, nodes, edges } = req.body;
        if (!title || !nodes || !Array.isArray(nodes)) {
            return res.status(400).json({ message: "Invalid request format" });
        }

        const createdNodes = await StudyPlanNode.insertMany(nodes);
        const nodeIdMap = new Map<string, mongoose.Types.ObjectId>();
        createdNodes.forEach(node => nodeIdMap.set(node.title, node._id));
        // console.log(nodeIdMap);
        // console.log(edges);
        const mappedEdges = edges.map(edge => ({
            from: nodeIdMap.get(edge.from),
            to: nodeIdMap.get(edge.to),
            label: edge.label || ""
        }));

        console.log(mappedEdges);
        const studyPlan = new StudyPlan({
            title,
            nodes: createdNodes.map(node => node._id),
            edges: mappedEdges
        });
        await studyPlan.save();

        user.studyPlans.push(studyPlan._id);
        await user.save();

        res.status(201).json(studyPlan);
    } 
    catch (error) 
    {
        return res.status(500).json({ message: 'Server error', error });
    }
}




export const getStudyPlans = async (req: Request, res: Response) => {
    try {
        const username = res.locals.jwtData.username;
        const user =  await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const studyPlans = await StudyPlan.find({ _id: { $in: user.studyPlans } })
            .populate("nodes")
            .populate("edges.from")
            .populate("edges.to");

        res.json(studyPlans);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const generateStudyPlan = async (req: Request, res: Response) => {
    try {
        const username = res.locals.jwtData.username;
        const user =  await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        const {experience, topic, level} = req.body;

        const result = await generateStudyPlanAI(experience, topic, level);
        return 

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
