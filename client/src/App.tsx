import "./App.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { LandingPage } from "./views/LandingPage";
import { LoginPage } from "./views/LoginPage";
import { PageNotFound } from "./views/PageNotFound";
import Dashboard from "./views/Dashboard";
import Profile from "./views/Profile";
import { ViewAnalysis } from "./views/ViewAnalysis.tsx";
import LearningEnvironment from "./views/LearningEnvironment.tsx";
import { useAuth } from "./context/AuthContext";
import Navbar from "./views/Navbar";
import { useState } from "react";
import { X, Menu } from "lucide-react";
import DailyQuestion from './views/DailyQuestion';
import CourseSelection from "./views/CourseSelection";
import Plans from "./studyPlan/Plans.tsx";
import FlowChart from "./studyPlan/FlowChart.tsx";
import Interview from "./views/Interview";
import BattleArena from "./BattleArena/Arena.tsx";
import { QuizAuthProvider } from "./context/QuizAuthContext";

// New layout for authenticated routes, placing Navbar on top
function AuthenticatedLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <QuizAuthProvider>
      <Navbar />
      {/* Mobile Navigation Toggle moved from Dashboard */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-gray-800 rounded-md"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>
      <Outlet context={{ mobileMenuOpen, setMobileMenuOpen }} />
    </QuizAuthProvider>
  );
}

function App() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Simple loading fallback

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      {isLoggedIn && (
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analysis" element={<ViewAnalysis />} />
          <Route path="/learn" element={<CourseSelection />} />
          <Route path="/learn/:courseId" element={<LearningEnvironment />} />
          <Route path="/daily-question" element={<DailyQuestion />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/flow" element={<FlowChart />} />
          {/* Added Interview route */}
          < Route path="/arena" element={<BattleArena />} />
          <Route path="/interview" element={<Interview />} />
        </Route>
      )}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
