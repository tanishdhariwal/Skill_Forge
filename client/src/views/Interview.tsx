import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send } from 'lucide-react';

export default function Interview() {
	// ...existing state declarations...
	const [topic, setTopic] = useState("");
	const [jobDescription, setJobDescription] = useState("");
	const [jobRole, setJobRole] = useState("");
	const [experience, setExperience] = useState<number>(0);
	const [interviewId, setInterviewId] = useState("");
	const [started, setStarted] = useState(false);
	const [conversation, setConversation] = useState<{ speaker: 'ai' | 'user'; text: string }[]>([]);
	const [userAnswer, setUserAnswer] = useState("");
	const [loading, setLoading] = useState(false);
	const [finished, setFinished] = useState(false);
	const [listening, setListening] = useState(false);

	// Start interview using provided sample endpoint & payload
	const startInterview = async () => {
		if (!topic.trim()) return;
		setLoading(true);
		try {
			const res = await axios.post("/interview/start_interview", {
				title: topic,
				jobDescription: jobDescription || "a candidate well versed in " + topic,
				jobRole: jobRole || "developer",
				experience: experience || 0
			});
			// Extract interview id and first question from response
			const { id, exchanges } = res.data;
			setInterviewId(id);
			const firstQuestionJson = JSON.parse(exchanges[0].question.questionText);
			const firstQuestion = firstQuestionJson.question;
			setConversation([
				{ speaker: 'ai', text: `Welcome to your interview on "${topic}".` },
				{ speaker: 'ai', text: firstQuestion }
			]);
			setStarted(true);
		} catch (error) {
			console.error("Error starting interview:", error);
			// Optionally display error message
			alert("Error starting interview. Please ensure you are authorized.");
		} finally {
			setLoading(false);
		}
	};

	// Submit answer and proceed to next question via sample endpoint
	const submitAnswer = async () => {
		if (!userAnswer.trim() || finished) return;
		// Append user's answer and clear input
		setConversation(prev => [...prev, { speaker: 'user', text: userAnswer }]);
		const answerToSend = userAnswer;
		setUserAnswer("");
		setLoading(true);
		try {
			const res = await axios.post(`/interview/next/${interviewId}`, { answer: answerToSend });
			if (res.data.finished) {
				setConversation(prev => [...prev, { speaker: 'ai', text: res.data.message }]);
				setFinished(true);
			} else if (res.data.exchanges && Array.isArray(res.data.exchanges)) {
				const exchanges = res.data.exchanges;
				// Take the last exchange as the new question (which hasn't been answered yet)
				const lastExchange = exchanges[exchanges.length - 1];
				let nextQuestion = lastExchange?.question?.questionText || "";
				try {
					const parsed = JSON.parse(nextQuestion);
					if (parsed.question) nextQuestion = parsed.question;
				} catch (e) {
					// Use plain text if parsing fails
				}
				if (res.data.message) {
					setConversation(prev => [...prev, { speaker: 'ai', text: res.data.message }]);
				}
				setConversation(prev => [...prev, { speaker: 'ai', text: nextQuestion }]);
			}
		} catch (error) {
			console.error("Error submitting answer:", error);
			setConversation(prev => [...prev, { speaker: 'ai', text: "Error retrieving next question." }]);
		} finally {
			setLoading(false);
		}
	};

	// Simulated speech recording
	const handleStartRecording = () => {
		setListening(true);
		setTimeout(() => {
			setUserAnswer("This is a simulated speech answer.");
			setListening(false);
		}, 2000);
	};

	const finishInterview = async () => {
		// Prevent multiple submissions
		if (finished) return;
		setLoading(true);
		try {
			const res = await axios.post(`/interview/submit/${interviewId}`, {}); 
			// Append final message from backend if available
			setConversation(prev => [...prev, { speaker: 'ai', text: res.data.message || "Interview finished." }]);
			setFinished(true);
		} catch (error) {
			console.error("Error finishing interview:", error);
			alert("Error finishing interview.");
		} finally {
			setLoading(false);
		}
	};

	if (!started) {
		return (
			<div className="min-h-screen bg-slate-950 pt-16 text-white flex flex-col items-center">
				<Card className="w-full max-w-md m-4 shadow-lg">
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Setup Mock Interview</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* ...Setup form fields */}
						<div>
							<label className="block text-sm font-medium mb-1">Interview Topic</label>
							<Input
								type="text"
								placeholder="e.g., Java, React, Machine Learning..."
								value={topic}
								onChange={(e) => setTopic(e.target.value)}
								className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Job Role (Optional)</label>
							<Input
								type="text"
								placeholder="e.g., Frontend Developer, Data Scientist..."
								value={jobRole}
								onChange={(e) => setJobRole(e.target.value)}
								className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Years of Experience</label>
							<Input
								type="number"
								min={0}
								max={20}
								value={experience}
								onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
								className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Job Description (Optional)</label>
							<Input
								type="text"
								placeholder="Brief job description for tailored questions..."
								value={jobDescription}
								onChange={(e) => setJobDescription(e.target.value)}
								className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400"
							/>
						</div>
						<div className="mt-6 flex justify-end">
							<Button onClick={startInterview} disabled={!topic.trim() || loading}>
								{loading ? "Starting..." : "Start Interview"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-950 pt-16 text-white flex flex-col items-center">
			<Card className="w-full max-w-2xl m-4 shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Interview on "{topic}"</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<AnimatePresence>
							{conversation.map((item, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className={`p-3 rounded-md ${item.speaker === 'ai' ? 'bg-gray-700' : 'bg-blue-600 text-white'}`}
								>
									{item.text}
								</motion.div>
							))}
						</AnimatePresence>
						{loading && (
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
								<div className="max-w-[80%] rounded-lg bg-gray-700 px-4 py-2 text-gray-100">
									<div className="flex space-x-1">
										<motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="h-2 w-2 rounded-full bg-gray-400" />
										<motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-2 w-2 rounded-full bg-gray-400" />
										<motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-2 w-2 rounded-full bg-gray-400" />
									</div>
								</div>
							</motion.div>
						)}
					</div>
					<div className="mt-6 flex items-center gap-2">
						<Input
							type="text"
							placeholder="Type your answer..."
							value={userAnswer}
							onChange={(e) => setUserAnswer(e.target.value)}
							className="flex-1 rounded-full bg-gray-800 px-4 py-2 text-white placeholder-gray-400 outline-none"
							disabled={loading || finished}
							onKeyPress={(e) => { if (e.key === 'Enter') submitAnswer(); }}
						/>
						<Button onClick={submitAnswer} disabled={!userAnswer.trim() || loading || finished} className="rounded-full">
							<Send className="h-5 w-5" />
						</Button>
						<Button onClick={handleStartRecording} variant="outline" disabled={listening || finished} className="rounded-full">
							<Mic className={`h-5 w-5 ${listening ? 'animate-pulse' : ''}`} />
						</Button>
					</div>
					{/* New End Interview button */}
					<div className="mt-4 flex justify-end">
						<Button onClick={finishInterview} disabled={finished || loading} className="rounded-full bg-red-600 hover:bg-red-700">
							End Interview
						</Button>
					</div>
					{finished && (
						<motion.div 
							initial={{ opacity: 0 }} 
							animate={{ opacity: 1 }} 
							className="mt-4 p-4 bg-green-700/50 border border-green-600 rounded-md"
						>
							<p className="font-medium">Interview completed! Thank you for participating.</p>
						</motion.div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
