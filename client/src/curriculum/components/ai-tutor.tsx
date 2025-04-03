import React, { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";
import { RiRobot3Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function AiTutor({ context }: { context: string }) {
  const apiKey = "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";
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  
  const [query, setQuery] = useState("");
  // Updated default messages state to provide an initial AI greeting
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "I am your AI tutor, how can I help you?" }
  ]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleQuerySubmit = async (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    const currentQuery = query;
    setQuery("");
    
    try {
      const res = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Imagine you are a professional ${context} Assistant. 
Dont say anything about the query which is out of context.
You have explained the concept of ${context}. A student has asked a question related to this: '${currentQuery}'. 
Try to answer the question in short and clear manner. Unless the user asks to explain something in detail then 
Provide a clear answer for this question in max of 1000 words, ensuring it remains relevant to the ${context} being discussed.
DO NOT ADD ANY ADDITIONAL CONTEXT OR EXPLANATION, AND STRICTLY FOLLOW THE ABOVE INSTRUCTIONS. 
IF THE QUERY IS NOT RELATED TO THE ${context} BEING DISCUSSED, DON'T ANSWER IT AT ALL.`
          }
        ],
        model: "llama3-8b-8192",
      });
  
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.choices[0].message.content ?? "No response available." },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSend = () => {
    const fakeEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
    handleQuerySubmit(fakeEvent);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">AI Tutor</h1>
        <p className="text-gray-400">Ask questions about {context} and get instant answers</p>
      </div>
  
      <div className="flex-1 rounded-xl bg-gray-800/50 border border-gray-700 p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  )}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-lg bg-gray-700 px-4 py-2 text-gray-100">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="h-2 w-2 rounded-full bg-gray-400"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="h-2 w-2 rounded-full bg-gray-400"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="h-2 w-2 rounded-full bg-gray-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
  
        <div className="mt-4 flex items-center gap-2">
          <motion.input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your question..."
            className="flex-1 rounded-full bg-gray-700 px-4 py-2 text-white placeholder-gray-400 outline-none ring-blue-500 focus:ring-2"
          />
          <motion.button
            onClick={handleSend}
            disabled={!query.trim()}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              query.trim()
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-gray-700 text-gray-400"
            )}
            whileHover={query.trim() ? { scale: 1.1 } : {}}
            whileTap={query.trim() ? { scale: 0.9 } : {}}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default AiTutor;

