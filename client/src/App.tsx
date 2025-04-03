import "./App.css";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./views/LandingPage";
import { LogiPage } from "./views/LoginPage";
import { PageNotFound } from "./views/PageNotFound";
import Dashboard from "./views/Dashboard";
import Profile from "./views/Profile";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LogiPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
