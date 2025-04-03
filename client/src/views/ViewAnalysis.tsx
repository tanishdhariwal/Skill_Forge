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
  marks: number; // Added marks property
  code?: string;
}

// Sample hard-coded data
const sampleInterviewData: InterviewData = {
  marks: 7.5, // 75%
  feedback: {
    summary:
      "The candidate demonstrated good understanding of core programming concepts but could improve in some areas. They showed strong problem-solving skills and communication ability, but need to work on optimization techniques and edge case handling.",
    strengths: [
      "Strong understanding of data structures",
      "Good problem-solving approach",
      "Clear communication of thought process",
      "Solid knowledge of algorithmic complexity",
    ],
    weaknesses: [
      "Could improve code optimization",
      "Missed some edge cases in solutions",
      "Needs more practice with dynamic programming",
      "Limited knowledge of system design principles",
    ],
  },
};

const sampleExchanges: InterviewExchange[] = [
  {
    id: 1,
    question:
      "Explain the difference between a stack and a queue and provide a real-world example for each.",
    response:
      "A stack is a LIFO (Last-In-First-Out) data structure, while a queue is FIFO (First-In-First-Out). \n\nFor a stack, think of a stack of plates - you add and remove from the top. An example implementation would be:\n```javascript\nclass Stack {\n  constructor() {\n    this.items = [];\n  }\n  \n  push(item) {\n    this.items.push(item);\n  }\n  \n  pop() {\n    return this.items.pop();\n  }\n}\n```\n\nFor a queue, think of people waiting in line - first come, first served. An implementation would be:\n```javascript\nclass Queue {\n  constructor() {\n    this.items = [];\n  }\n  \n  enqueue(item) {\n    this.items.push(item);\n  }\n  \n  dequeue() {\n    return this.items.shift();\n  }\n}\n```",
    feedback:
      "Excellent explanation of the fundamental differences between stacks and queues. Your code examples were clear and correctly implemented the core operations for each data structure. You could have mentioned the time complexity of operations and potential memory concerns, but overall, this was a strong answer.",
    marks: 9,
  },
  {
    id: 2,
    question:
      "Write an algorithm to find the longest palindromic substring in a given string.",
    response:
      'I\'ll use the expand around center approach:\n\n```python\ndef longest_palindrome(s):\n    if not s:\n        return ""\n        \n    start = end = 0\n    \n    for i in range(len(s)):\n        # Expand around center for odd length palindromes\n        len1 = expand_around_center(s, i, i)\n        # Expand around center for even length palindromes\n        len2 = expand_around_center(s, i, i + 1)\n        \n        max_len = max(len1, len2)\n        if max_len > (end - start):\n            start = i - (max_len - 1) // 2\n            end = i + max_len // 2\n    \n    return s[start:end+1]\n\ndef expand_around_center(s, left, right):\n    while left >= 0 and right < len(s) and s[left] == s[right]:\n        left -= 1\n        right += 1\n    \n    return right - left - 1\n```',
    feedback:
      "Your solution using the expand around center approach is correct and efficient with O(n²) time complexity. You've handled both even and odd-length palindromes properly. The algorithm correctly identifies the longest palindromic substring. For improvement, you could have discussed the time and space complexity in your explanation, and mentioned alternative approaches like dynamic programming.",
    marks: 8,
    // code: "def longest_palindrome(s):\n    if not s:\n        return \"\"\n        \n    start = end = 0\n    \n    for i in range(len(s)):\n        # Expand around center for odd length palindromes\n        len1 = expand_around_center(s, i, i)\n        # Expand around center for even length palindromes\n        len2 = expand_around_center(s, i, i + 1)\n        \n        max_len = max(len1, len2)\n        if max_len > (end - start):\n            start = i - (max_len - 1) // 2\n            end = i + max_len // 2\n    \n    return s[start:end+1]\n\ndef expand_around_center(s, left, right):\n    while left >= 0 and right < len(s) and s.left == s.right):\n        left -= 1\n        right += 1\n    \n    return right - left - 1"
  },
  {
    id: 3,
    question:
      "Explain how you would design a URL shortening service like TinyURL.",
    response:
      "For a URL shortening service, I'd consider these components:\n\n1. **API Gateway**: To handle HTTP requests\n2. **Application Service**: Business logic for shortening URLs\n3. **Database**: Store mappings between short and long URLs\n4. **Cache Layer**: To quickly retrieve popular URLs\n\nFor the actual shortening algorithm, I could use:\n- Hash function (MD5/SHA-256) + Base62 encoding\n- Or a simple counter with Base62 conversion\n\nThe data schema would be:\n```sql\nCREATE TABLE url_mappings (\n  id BIGINT PRIMARY KEY AUTO_INCREMENT,\n  original_url VARCHAR(2048) NOT NULL,\n  short_code VARCHAR(10) NOT NULL UNIQUE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  expiry_date TIMESTAMP NULL,\n  user_id BIGINT NULL\n);\n```",
    feedback:
      "Your answer provides a solid high-level design for a URL shortening service. You've correctly identified the main components needed and presented two valid approaches for generating short URLs. Your database schema is appropriate for the task. To improve, you could have discussed scalability challenges (like distributed systems for high traffic) and additional features such as analytics, custom URLs, or security considerations. Consider also how you would handle collisions in your hashing approach.",
    marks: 7,
  },
  {
    id: 4,
    question: "Implement a function to check if a binary tree is balanced.",
    response:
      "A balanced binary tree has a height difference of at most 1 between the left and right subtrees of every node.\n\n```java\npublic class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    \n    TreeNode(int x) { val = x; }\n}\n\npublic boolean isBalanced(TreeNode root) {\n    return checkHeight(root) != -1;\n}\n\nprivate int checkHeight(TreeNode node) {\n    if (node == null) return 0;\n    \n    int leftHeight = checkHeight(node.left);\n    if (leftHeight == -1) return -1;\n    \n    int rightHeight = checkHeight(node.right);\n    if (rightHeight == -1) return -1;\n    \n    if (Math.abs(leftHeight - rightHeight) > 1) return -1;\n    \n    return Math.max(leftHeight, rightHeight) + 1;\n}\n```",
    feedback:
      "Your solution correctly implements a bottom-up approach to check if a binary tree is balanced, with an efficient O(n) time complexity. The algorithm cleverly uses -1 as a sentinel value to indicate imbalance, avoiding unnecessary calculations once an imbalance is detected. You've provided a clear TreeNode class definition and your code is well-structured. The explanation of what makes a balanced tree was accurate and concise.",
    marks: 9,
    // code: "public class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    \n    TreeNode(int x) { val = x; }\n}\n\npublic boolean isBalanced(TreeNode root) {\n    return checkHeight(root) != -1;\n}\n\nprivate int checkHeight(TreeNode node) {\n    if (node == null) return 0;\n    \n    int leftHeight = checkHeight(node.left);\n    if (leftHeight == -1) return -1;\n    \n    int rightHeight = checkHeight(node.right);\n    if (rightHeight == -1) return -1;\n    \n    if (Math.abs(leftHeight - rightHeight) > 1) return -1;\n    \n    return Math.max(leftHeight, rightHeight) + 1;\n}"
  },
  {
    id: 5,
    question:
      "Explain the concept of a hash table and how collisions are handled.",
    response:
      "A hash table is a data structure that implements an associative array abstract data type, a structure that can map keys to values. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.\n\nCollisions occur when the hash function generates the same index for multiple keys. There are several ways to handle collisions:\n\n1. **Chaining**: Each bucket contains a linked list of entries. When a collision occurs, the new entry is appended to the list.\n\n2. **Open Addressing**: All entries are stored in the hash table itself. When a collision occurs, we look for the next available slot using techniques like:\n   - Linear Probing: Check the next slot sequentially\n   - Quadratic Probing: Check slots at quadratic intervals\n   - Double Hashing: Use a second hash function to determine the interval\n\n3. **Robin Hood Hashing**: A variation of open addressing where entries with a higher probe count can evict entries with a lower probe count.\n\nEach approach has trade-offs regarding performance, memory usage, and implementation complexity.",
    feedback:
      "Your explanation of hash tables and collision resolution strategies is comprehensive and accurate. You've effectively covered the main approaches (chaining and open addressing) along with their variations. Your answer demonstrates a solid understanding of the data structure and its implementation challenges. To enhance this further, you could have briefly mentioned the time complexity implications of these different collision handling strategies and perhaps given a simple example of how chaining or probing works in practice.",
    marks: 8,
  },
];

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
    // You can add a toast notification here if desired
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
  const state =
    (useLocation().state as {
      student?: any;
      interviewId?: string;
      rollNo?: string;
    }) || {};

  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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

  // Use the hard-coded data
  const interviewData = sampleInterviewData;
  const exchanges = sampleExchanges;

  return (

    <>
    <Navbar/>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Interview Title Header */}
          <Card className="shadow-lg  bg-gray-200 dark:bg-gray-900">
            <CardHeader className="">
              <CardTitle className="text-3xl font-bold text-primary flex justify-between items-center">
                <span>Technical Java Interview</span>
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
                    className={`text-2xl font-bold
                    ${
                      interviewData.marks * 10 < 50
                        ? "text-red-600"
                        : interviewData.marks * 10 < 70
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {interviewData.marks * 10}%
                  </span>
                </div>
                
                <div className="relative">
                  {/* Custom progress bar implementation */}
                  <div className="h-6 w-full bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className={`h-full ${
                        interviewData.marks * 10 < 50
                          ? "bg-red-500"
                          : interviewData.marks * 10 < 70
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${interviewData.marks * 10}%` }}
                    >
                    </div>
                  </div>
                  
                  {/* Text overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white drop-shadow-md">
                      {interviewData.marks * 10 < 50
                        ? "Needs Improvement"
                        : interviewData.marks * 10 < 70
                        ? "Good"
                        : "Excellent"
                      }
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

          {/* Strengths and Weaknesses - Single Horizontal Tile */}
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

          {/* Detailed Questions Analysis - Keep as is */}
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

          {/* Footer section with tips and Study button */}
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
