import axios from 'axios';

export interface QuestionType {
  _id: string;
  question: string;
  topic: string;
  options: string[];
  correctAnswer: string;
  date: string;
}

export const getStreakQuestions = async (): Promise<QuestionType[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/v1/quiz/getStreakQuestions');
    return response.data;
  } catch (error) {
    console.error('Error fetching streak questions:', error);
    throw new Error('Failed to fetch daily questions');
  }
};

// export const submitAnswer = async (questionId: string, selectedAnswer: string): Promise<boolean> => {
//   try {
//     const response = await axios.post('/quiz/submitAnswer', {
//       questionId,
//       answer: selectedAnswer
//     });
//     return response.data.correct;
//   } catch (error) {
//     console.error('Error submitting answer:', error);
//     throw new Error('Failed to submit answer');
//   }
// };
