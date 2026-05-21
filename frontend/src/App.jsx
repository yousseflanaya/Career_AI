import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CVBuilderPage from './pages/CVBuilderPage';
import CareerQuizPage from './pages/CareerQuizPage';
import CoverLetterPage from './pages/CoverLetterPage';
import SettingsPage from './pages/SettingsPage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import CVIntelligencePage from './pages/CVIntelligencePage';
import RoadmapPage from './pages/RoadmapPage';
import PortfolioPage from './pages/PortfolioPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans relative transition-colors duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portfolio/:username" element={<PublicPortfolioPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cv-builder" element={<CVBuilderPage />} />
            <Route path="/cv-intelligence" element={<CVIntelligencePage />} />
            <Route path="/quiz" element={<CareerQuizPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/cover-letter" element={<CoverLetterPage />} />
            <Route path="/interview-prep" element={<InterviewPrepPage />} />
            <Route path="/interview/history" element={<InterviewHistoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <ChatbotWidget />
      </div>
    </Router>
  );
}

export default App;
