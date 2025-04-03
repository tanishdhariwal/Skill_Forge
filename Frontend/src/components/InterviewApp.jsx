
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Volume2, Mic, Send, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../services/AuthService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InterviewApp() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chatContainerRef = useRef(null);
  const textAreaRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (user?.email) fetchInterviewHistory();
  }, [user?.email]);

  const fetchInterviewHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/interview?email=${user.email}`);
      // console.log(res);
      setInterviewHistory(res.data);
      if (res.data.length > 0) loadPreviousInterview(res.data[0]);
    } catch (error) {
      console.error("Error fetching interview history:", error);
      // toast.error("Failed to fetch interview history!");
    }
  };

    // 🎤 SPEAKER BUTTON FUNCTION (TTS)
  const toggleSpeak = () => {
    if (!chatHistory.length) return;
    const lastAIMessage = chatHistory.filter((msg) => msg.role === "AI").pop()?.content;
    if (!lastAIMessage) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(lastAIMessage);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
      setIsSpeaking(true);
    }
  };

  //  🎙️ MICROPHONE BUTTON FUNCTION (STT)
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognition.start();
  };

  const startInterview = async () => {
    if (!topic.trim()) {
      toast.warn("Please enter a topic!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/start-interview", { email: user.email, topic });
      const newInterview = {
        sessionId: res.data.sessionId,
        topic,
        email: user.email,
        timestamp: new Date().toISOString(),
        chatHistory: [{ role: "AI", content: res.data.question }],
      };

      setSessionId(res.data.sessionId);
      setChatHistory(newInterview.chatHistory);
      setInterviewHistory([newInterview, ...interviewHistory]);
      setTopic("");

      await axios.post("http://localhost:3000/api/save-interview", newInterview);
      fetchInterviewHistory();
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error("Enter topic related to computer science only...!",{ position: "top-center" });
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.warn("Answer cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/answer", { sessionId, answer });

      const updatedChatHistory = [
        ...chatHistory,
        { role: "User", content: answer },
        { role: "AI", content: res.data.followUpQuestion },
      ];

      setChatHistory(updatedChatHistory);
      setAnswer("");

      await axios.post("http://localhost:3000/api/update-interview", {
        sessionId,
        email: user.email,
        chatHistory: updatedChatHistory,
      });

      setInterviewHistory((prevHistory) =>
        prevHistory.map((intv) => (intv.sessionId === sessionId ? { ...intv, chatHistory: updatedChatHistory } : intv))
      );
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer!");
    }
    setLoading(false);
  };

  const deleteInterview = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete-interview?sessionId=${sessionId}&email=${user.email}`);
      setInterviewHistory(interviewHistory.filter((interview) => interview.sessionId !== sessionId));
      fetchInterviewHistory();
      toast.success("Interview deleted successfully!");
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview!");
    }
  };

  const loadPreviousInterview = (interview) => {
    setSessionId(interview.sessionId);
    setChatHistory(interview.chatHistory);
  };

  return (
    <div className="flex h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Interview History</h2>
        <button onClick={() => setSessionId(null)} className="mb-4 bg-blue-500 p-2 rounded-lg flex items-center">
          <Plus size={16} className="mr-2" />
          Start New Interview
        </button>
        <div className="space-y-2 overflow-y-auto flex-1">
          {interviewHistory.map((interview, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
              <button className="text-left flex-1" onClick={() => loadPreviousInterview(interview)}>
                {interview.topic}
              </button>
              <button onClick={() => deleteInterview(interview.sessionId)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 p-8 flex flex-col">
        <motion.h1 className="text-3xl font-bold mb-6">🎤 AI Interview Simulator</motion.h1>
        {!sessionId ? (
          <div className="max-w-xl bg-white p-6 rounded-xl shadow-lg border">
            <label className="block text-lg font-medium mb-2">Enter Topic:</label>
            <input type="text" placeholder="e.g., Java" className="w-full p-3 rounded-lg border" value={topic} onChange={(e) => setTopic(e.target.value)} />
            <button onClick={startInterview} className="mt-4 w-full bg-black text-white p-3 rounded-lg">{loading ? "Starting..." : "Start Interview"}</button>
          </div>
        ) : (
          <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border flex flex-col mb-6">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-2">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`p-3 rounded-lg ${msg.role === "AI" ? "bg-gray-300 flex justify-between" : "bg-gray-100"}`}>
                  <strong>{msg.role}:</strong> {msg.content}
                  {msg.role === "AI" && <button onClick={toggleSpeak}><Volume2 size={20} /></button>}
                </div>
              ))}
            </div>
            <div className="flex items-center border rounded-lg p-2 mt-4 bg-gray-50">
              <textarea ref={textAreaRef} className="flex-1 p-2 resize-none focus:outline-none min-h-[60px]" rows={2} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer..." />
              <button onClick={startListening}><Mic size={20} /></button>
              <button onClick={submitAnswer}><Send size={20} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
