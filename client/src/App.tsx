import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
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

// New layout for authenticated routes, placing Navbar on top
function AuthenticatedLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
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
    </>
  );
}

function App() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Simple loading fallback

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
      {isLoggedIn && (
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analysis" element={<ViewAnalysis />} />
          <Route path="/learn" element={<LearningEnvironment />} />
          <Route path="/daily-question" element={<DailyQuestion />} />
        </Route>
      )}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
