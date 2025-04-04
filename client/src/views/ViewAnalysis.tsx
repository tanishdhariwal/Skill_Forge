import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
} from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { JSX } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";
import axios from "axios";

interface InterviewData {
  marks: number;
  feedback: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
  };
}

interface InterviewExchange {
  id: number;
  question: string;
  response: string;
  feedback: string;
  marks: number;
  code?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Code copied to clipboard");
  });
};

const formatContent = (content: string) => {
  const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  const elements: (string | JSX.Element)[] = [];
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const [fullMatch, language, code] = match;
    const start = match.index;
    if (start > lastIndex) {
      elements.push(content.slice(lastIndex, start));
    }
    elements.push(
      <SyntaxHighlighter language={language} style={materialDark} key={start}>
        {code}
      </SyntaxHighlighter>
    );
    lastIndex = start + fullMatch.length;
  }
  if (lastIndex < content.length) {
    elements.push(content.slice(lastIndex));
  }
  return elements;
};

export function ViewAnalysis() {
  const { id } = useParams<{ id: string }>();
  console.log(id, "id from params");
    const state = (useLocation().state as {
      student?: { name: string; age: number }; // Replace with the actual structure of 'student'
      interviewId?: string;
      rollNo?: string;
    }) || {};

  const [interviewData, setInterviewData] = React.useState<InterviewData | null>(null);
  const [exchanges, setExchanges] = React.useState<InterviewExchange[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await axios.get(`/interview/${id}`);
        const data = await response.data;

        const parsedFeedback = JSON.parse(data.interview.interviewfeedback);
        const parsedExchanges = data.interview.exchanges.map((exchange: any) => ({
          id: exchange._id,
          question: JSON.parse(exchange.question.questionText).question,
          response: exchange.answer || "No response provided.",
          feedback: exchange.exchangeFeedback
            ? JSON.parse(exchange.exchangeFeedback).feedback
            : "No feedback available.",
          marks: exchange.marks,
        }));

        setInterviewData({
          marks: data.interview.score * 10,
          feedback: {
            summary: parsedFeedback.feedback,
            strengths: parsedFeedback.strengths || [],
            weaknesses: parsedFeedback.weaknesses || [],
          },
        });
        setExchanges(parsedExchanges);
      } catch (error) {
        console.error("Error fetching interview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [id]);

  const detectLanguage = (code: string) => {
    if (code.includes("public class") || code.includes("System.out.println")) {
      return "java";
    } else if (code.includes("def ") || code.includes("print(")) {
      return "python";
    } else {
      return "javascript";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
          <span className="text-lg font-medium text-gray-800">
            Loading interview analysis...
          </span>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
          <span className="text-lg font-medium text-gray-800">
            Failed to load interview data.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Interview Title Header */}
            <Card className="shadow-lg bg-gray-200 dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary flex justify-between items-center">
                  <span>{state.student?.title || "Technical Interview"}</span>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Overall Score */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 -mt-6 p-2">
                <CardTitle className="text-2xl font-bold text-blue-700 m-0 p-2">
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="w-full">
                  <div className="mb-4 flex justify-between items-center">
                    <span className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                      Performance
                    </span>
                    <span
                      className={`text-2xl font-bold ${
                        interviewData.marks < 50
                          ? "text-red-600"
                          : interviewData.marks < 70
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {interviewData.marks}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-6 w-full bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${
                          interviewData.marks < 50
                            ? "bg-red-500"
                            : interviewData.marks < 70
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${interviewData.marks}%` }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white drop-shadow-md">
                        {interviewData.marks < 50
                          ? "Needs Improvement"
                          : interviewData.marks < 70
                          ? "Good"
                          : "Excellent"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-medium">
                    <span className="text-red-600">Poor</span>
                    <span className="text-amber-600">Average</span>
                    <span className="text-emerald-600">Excellent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Feedback */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-b">
                  <CardTitle className="text-2xl font-bold text-gray-500">
                    Overall Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-700 leading-relaxed text-lg text-left dark:text-gray-300">
                    {interviewData.feedback.summary}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Strengths and Weaknesses */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg w-full">
                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 -mt-6">
                  <CardTitle className="text-2xl font-bold text-indigo-700">
                    Strengths & Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-emerald-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {interviewData.feedback.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-emerald-500 mr-2">•</span>
                            <span className="text-slate-700 dark:text-slate-200">
                              {strength}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-rose-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Weaknesses
                      </h3>
                      <ul className="space-y-2">
                        {interviewData.feedback.weaknesses.map(
                          (weakness, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-rose-500 mr-2">•</span>
                              <span className="text-slate-700 dark:text-slate-200">
                                {weakness}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Questions Analysis */}
            <motion.div variants={containerVariants} className="space-y-6">
              <h2 className="text-2xl font-bold text-primary inline-flex items-center border-b-2 border-primary pb-2">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Detailed Question Analysis
              </h2>

              <div className="space-y-6">
                {exchanges.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="w-full"
                  >
                    <Card
                      className={`cursor-pointer transition-colors ${
                        expandedQuestion === index
                          ? "bg-gradient-to-r from-slate-100 to-blue-200 p-6 dark:from-gray-900 dark:to-slate-700"
                          : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 "
                      }`}
                    >
                      <CardHeader
                        onClick={() =>
                          setExpandedQuestion(
                            expandedQuestion === index ? null : index
                          )
                        }
                      >
                        <CardTitle className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="flex justify-center items-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                              {index + 1}
                            </div>
                            <span className="text-xl font-semibold text-slate-800 line-clamp-1 dark:text-slate-200">
                              {item.question.length > 60
                                ? `${item.question.substring(0, 60)}...`
                                : item.question}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={`px-3 py-1 text-sm font-medium shadow-sm rounded-md ${
                                item.marks >= 8
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                                  : item.marks >= 6
                                  ? "bg-amber-100 text-amber-800 dark:amber-950 dark:text-amber-800"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {item.marks}/10
                            </Badge>
                            {expandedQuestion === index ? (
                              <ChevronUpIcon className="w-5 h-5 text-slate-500" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedQuestion === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <CardContent className="p-6">
                              <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-800">
                                  <h3 className="font-semibold text-lg mb-3 text-blue-700 flex items-center dark:text-blue-300">
                                    <svg
                                      className="w-5 h-5 mr-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Question:
                                  </h3>
                                  <p className="text-slate-700 whitespace-pre-line dark:text-white text-left">
                                    {item.question}
                                  </p>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-gray-800 dark:border-gray-800">
                                  <h3 className="font-semibold text-lg mb-3 text-indigo-700 flex items-center dark:text-indigo-300">
                                    <svg
                                      className="w-5 h-5 mr-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                      />
                                    </svg>
                                    Your Answer:
                                  </h3>
                                  <div className="text-slate-700 dark:text-white">
                                    {formatContent(item.response)}
                                  </div>
                                </div>

                                {item.code && (
                                  <div className="bg-gray-950 p-4 rounded-lg relative shadow-lg">
                                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                                      <span className="text-xs font-medium text-slate-300 bg-slate-800 rounded-md px-2 py-1">
                                        {detectLanguage(item.code)}
                                      </span>
                                      <button
                                        onClick={() =>
                                          copyToClipboard(item.code as string)
                                        }
                                        className="text-slate-300 hover:text-white focus:outline-none bg-slate-700 p-1 rounded"
                                        aria-label="Copy code"
                                      >
                                        <CopyIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <SyntaxHighlighter
                                      language={detectLanguage(item.code)}
                                      style={materialDark}
                                      className="mt-2 rounded-lg !bg-transparent !p-4"
                                    >
                                      {item.code.trim()}
                                    </SyntaxHighlighter>
                                  </div>
                                )}

                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                  <h3 className="font-semibold text-lg mb-3 text-purple-700 flex items-center">
                                    <svg
                                      className="w-5 h-5 mr-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                      />
                                    </svg>
                                    Feedback:
                                  </h3>
                                  <div className="text-slate-700">
                                    {formatContent(item.feedback)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Footer section */}
            <motion.div variants={itemVariants} className="mt-10">
              <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-blue-800">
                        Next Steps for Improvement
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-slate-700">
                            Review the detailed feedback for each question
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-slate-700">
                            Focus on improving areas identified in your weaknesses
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-slate-700">
                            Practice similar interview questions to build
                            confidence
                          </span>
                        </li>
                      </ul>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 text-lg rounded-lg shadow-md transition-all hover:shadow-lg flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Study Weak Topics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
