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
    // Use the route path without the full URL since axios.defaults.baseURL is set in main.tsx
    const response = await axios.get('/quiz/getStreakQuestions');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching streak questions:', error);
    
    // More detailed error information for debugging
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    }
    
    throw new Error('Failed to fetch daily questions: ' + (error.message || 'Unknown error'));
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
