import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionType, getStreakQuestions } from '../communications/quizCommunications';
import Navbar from './Navbar';
import { Check, Clock, ChevronRight, Loader2, X, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const DailyQuestion = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getStreakQuestions();
      setQuestions(data);
    } catch (error: any) {
      console.error('Failed to load questions:', error);
      setError(error?.message || 'Failed to load daily questions');
      toast.error('Failed to load daily questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (submittedAnswers[questionId] !== undefined) return; // Don't allow changing after submission
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAnswer = (questionId: string) => {
    const question = questions.find(q => q._id === questionId);
    if (!question) return;

    const selectedAnswer = selectedAnswers[questionId];
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    
    setSubmittedAnswers(prev => ({
      ...prev,
      [questionId]: isCorrect
    }));

    if (isCorrect) {
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentQuestionSubmitted = currentQuestion 
    ? submittedAnswers[currentQuestion._id] !== undefined 
    : false;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 pt-16 text-white">
        <motion.div 
          className="container mx-auto px-4 py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Daily Streak Questions</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500">
                <Calendar className="h-3 w-3 mr-1" />
                Daily Streak
              </Badge>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="ml-3 text-lg text-gray-400">Loading questions...</p>
            </div>
          ) : error ? (
            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 rounded-lg p-6 text-center"
            >
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Failed to Load Questions</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button 
                onClick={loadQuestions} 
                className="mx-auto flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </motion.div>
          ) : questions.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 rounded-lg p-6 text-center"
            >
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
              <p className="text-gray-400">There are no daily questions available at the moment. Please check back later.</p>
            </motion.div>
          ) : (
            <>
              <motion.div 
                variants={itemVariants} 
                className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="mb-3">{currentQuestion.topic}</Badge>
                    <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(currentQuestion.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion._id] === option;
                    const isSubmitted = submittedAnswers[currentQuestion._id] !== undefined;
                    const isCorrect = option === currentQuestion.correctAnswer;
                    
                    let optionClasses = "p-4 rounded-lg border transition-all";
                    
                    if (isSubmitted) {
                      if (isCorrect) {
                        optionClasses += " border-green-500 bg-green-500/10";
                      } else if (isSelected) {
                        optionClasses += " border-red-500 bg-red-500/10";
                      } else {
                        optionClasses += " border-gray-700 bg-gray-800/50";
                      }
                    } else {
                      optionClasses += isSelected
                        ? " border-blue-500 bg-blue-500/10"
                        : " border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-700/50";
                    }

                    return (
                      <motion.div 
                        key={index}
                        variants={itemVariants}
                        whileHover={!isSubmitted ? { x: 5 } : {}}
                        className={optionClasses}
                        onClick={() => handleSelectAnswer(currentQuestion._id, option)}
                      >
                        <div className="flex justify-between items-center">
                          <span>{option}</span>
                          {isSubmitted && isCorrect && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                          {isSubmitted && isSelected && !isCorrect && (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {!isCurrentQuestionSubmitted && (
                  <motion.button
                    variants={itemVariants}
                    disabled={!selectedAnswers[currentQuestion._id]}
                <div className="text-center">
                  <span className="text-gray-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                <button
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center px-4 py-2 rounded-md bg-gray-800 text-white disabled:bg-gray-800/50 disabled:text-gray-500"
                  onClick={handleNextQuestion}
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="mt-10"
              >
                <h2 className="text-xl font-bold mb-4">Your Progress</h2>
                <div className="flex justify-between items-center gap-4">
                  {questions.map((q, index) => {
                    const isAnswered = submittedAnswers[q._id] !== undefined;
                    const isCorrect = submittedAnswers[q._id] === true;
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <motion.div
                        key={q._id}
                        className={`flex-1 h-2 rounded-full ${
                          isAnswered 
                            ? (isCorrect ? 'bg-green-500' : 'bg-red-500')
                            : (isCurrent ? 'bg-blue-500' : 'bg-gray-700')
                        }`}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setCurrentQuestionIndex(index)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default DailyQuestion;
