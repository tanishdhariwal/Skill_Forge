import "./App.css";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./views/LandingPage";
import { LogiPage } from "./views/LoginPage";
import { PageNotFound } from "./views/PageNotFound";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LogiPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
