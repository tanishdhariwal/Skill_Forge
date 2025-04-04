import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface QuizUser {
  username: string;
  quizRating: number;
}

interface QuizAuthContextType {
  quizUser: QuizUser | null;
  isInitialized: boolean;
}

const QuizAuthContext = createContext<QuizAuthContextType | null>(null);

export function QuizAuthProvider({ children }: { children: ReactNode }) {
  const [quizUser, setQuizUser] = useState<QuizUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setQuizUser({
        username: user.username,
        quizRating: 1000 // Default rating
      });
    } else {
      setQuizUser(null);
    }
    setIsInitialized(true);
  }, [user]);

  return (
    <QuizAuthContext.Provider value={{ quizUser, isInitialized }}>
      {children}
    </QuizAuthContext.Provider>
  );
}

export function useQuizAuth() {
  const context = useContext(QuizAuthContext);
  if (context === null) {
    throw new Error("useQuizAuth must be used within a QuizAuthProvider");
  }
  return context;
}
