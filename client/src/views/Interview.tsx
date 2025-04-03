import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send } from 'lucide-react';

const mockQuestions = [
  "Explain the difference between TCP and UDP.",
  "What is your greatest strength?",
  "Describe a challenging project you worked on.",
  "Where do you see yourself in five years?"
];

export default function Interview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [conversation, setConversation] = useState([
    { speaker: 'ai', text: 'Welcome to your mock interview. Let’s begin!' },
    { speaker: 'ai', text: mockQuestions[0] }
  ]);
  const [listening, setListening] = useState(false);

  // Text submission triggers appending user's answer and then simulates the next AI question.
  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    setConversation(prev => [...prev, { speaker: 'user', text: userAnswer }]);
    setUserAnswer("");
    // Simulate AI processing and response.
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < mockQuestions.length) {
        setConversation(prev => [...prev, { speaker: 'ai', text: mockQuestions[nextIndex] }]);
        setCurrentQuestionIndex(nextIndex);
      } else {
        setConversation(prev => [...prev, { speaker: 'ai', text: 'This concludes the interview. Thank you!' }]);
      }
    }, 1000);
  };

  // Simulated speech recognition: when the record button is clicked, after a delay a sample answer is inserted.
  const handleStartRecording = () => {
    setListening(true);
    setTimeout(() => {
      const simulatedSpeech = "This is a simulated speech answer.";
      setUserAnswer(simulatedSpeech);
      setListening(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16 text-white flex flex-col items-center">
      <Card className="w-full max-w-2xl m-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mock Interview</CardTitle>
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
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 rounded-full bg-gray-800 px-4 py-2 text-white placeholder-gray-400 outline-none"
            />
            <Button onClick={handleSubmit} disabled={!userAnswer.trim()} className="rounded-full">
              <Send className="h-5 w-5" />
            </Button>
            <Button onClick={handleStartRecording} variant="outline" disabled={listening} className="rounded-full">
              <Mic className={`h-5 w-5 ${listening ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}