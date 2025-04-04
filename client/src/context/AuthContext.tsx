import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, logoutUser, checkAuthStatus, signup as signupAPI } from "../communications/userCommunications";   

type User = {
  username: string;
  quizRating?: number;
};

type UserAuth = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (rollnumber: string, password: string) => Promise<void>;
  signup: (username: string, name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const data = await checkAuthStatus();
        if (data) {
          setUser({username: data.name});
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  const login = async (rollnumber: string, password: string) => {
    const data = await loginUser(rollnumber, password);
    console.log(data);
    if (data) {
      setUser({ username: data.name });
      setIsLoggedIn(true);
    }
  };

  const signup = async (username: string, name: string, email: string, password: string) => {
    const data = await signupAPI(username, name, email, password);
    if (data) {
      setUser({ username: data.name });
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
