import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Clock,
  Code,
  Database,
  Flame,
  Home,
  Layers,
  LogOut,
  Server,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchDashboardData } from '../communications/userCommunications';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// Category to icon mapping
const categoryIcons = {
  Frontend: Code,
  Backend: Server,
  Language: Layers,
  Database: Database
};

// Category to color mapping
const categoryColors = {
  Frontend: 'bg-blue-500',
  Backend: 'bg-green-500',
  Language: 'bg-yellow-500',
  Database: 'bg-purple-500'
};

// Mock data for the dashboard
const mockInterviewHistory = [
  { id: 1, title: 'JavaScript Fundamentals', date: '2023-10-15', score: 85, status: 'Completed' },
  { id: 2, title: 'React Hooks Deep Dive', date: '2023-10-12', score: 92, status: 'Completed' },
  { id: 3, title: 'Data Structures - Arrays', date: '2023-10-08', score: 78, status: 'Completed' },
  { id: 4, title: 'System Design Basics', date: '2023-10-05', score: 65, status: 'Needs Improvement' }
];

// Enhanced learning topics with additional fields
const mockLearningTopics = [
  { 
    id: 1, 
    title: 'React Fundamentals', 
    progress: 75, 
    category: 'Frontend', 
    difficulty: 'Intermediate',
    description: 'Building components and managing state'
  },
  { 
    id: 2, 
    title: 'TypeScript Basics', 
    progress: 50, 
    category: 'Language', 
    difficulty: 'Beginner',
    description: 'Type systems and interfaces'
  },
  { 
    id: 3, 
    title: 'Node.js API Development', 
    progress: 30, 
    category: 'Backend', 
    difficulty: 'Advanced',
    description: 'RESTful services with Express'
  }
];

const initialStreakData = {
  currentStreak: 15,
  longestStreak: 28,
  thisMonth: 22,
  lastMonth: 18,
  streakCalendar: [
    { date: '2023-10-01', completed: true },
    { date: '2023-10-02', completed: true },
    { date: '2023-10-03', completed: true },
    { date: '2023-10-04', completed: false },
    { date: '2023-10-05', completed: true },
    { date: '2023-10-06', completed: false },
    { date: '2023-10-07', completed: true },
    { date: '2023-10-08', completed: false },
    { date: '2023-10-09', completed: true },
    { date: '2023-10-10', completed: false },
    { date: '2023-10-11', completed: true },
    { date: '2023-10-12', completed: true },
    { date: '2023-10-13', completed: true },
    { date: '2023-10-14', completed: true },
    { date: '2023-10-15', completed: true },
  ]
};

// Navigation items - Schedule removed
const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Learning', path: '/learn' },
  { icon: BarChart3, label: 'Study Planner', path: '/plans' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Dashboard = () => {
  // Define initial state with mock data
  const [dashboardData, setDashboardData] = useState({
    userdata: {
      username: "Ramesh Rao",
      level: 1,
      exp: 0
    },
    interviewHistory: mockInterviewHistory,
    learningTopics: mockLearningTopics,
    streakData: initialStreakData,
    lastModule: {
      title: "React Hooks Deep Dive",
      module: "Module 4: useEffect Hook"
    }
  });
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDashboardData();
        if (response) {
          setDashboardData(prevData => ({
            userdata: response.userdata || prevData.userdata,
            interviewHistory: response.interviewHistory?.length ? response.interviewHistory : prevData.interviewHistory,
            learningTopics: response.learningTopics?.length ? response.learningTopics : prevData.learningTopics,
            streakData: response.streakData || prevData.streakData,
            lastModule: response.lastModule || prevData.lastModule
          }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Keep using the mock data which is already set as initial state
      }
    };

    fetchData();
  }, []);

  // Extract data from state
  const { userdata, interviewHistory, learningTopics, streakData, lastModule } = dashboardData;
  const username = userdata.username;

  // Function to generate calendar grid
  const generateCalendarGrid = () => {
    const today = new Date();
    const calendarDays = [];
    
    // Add some hardcoded completed days for testing if streakData is empty
    const testStreakCalendar = streakData.streakCalendar.length > 0 
      ? streakData.streakCalendar 
      : initialStreakData.streakCalendar;
    
    // Go back to show previous 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Format date as YYYY-MM-DD for comparison
      const dateString = date.toISOString().split('T')[0];
      
      // Search for this date in streak data
      const streakDay = testStreakCalendar.find(day => {
        const streakDate = day.date.split('T')[0];  // Handle if date has time component
        return streakDate === dateString;
      });
      
      // If found a match, use its completed status, otherwise use null
      calendarDays.push({
        date: dateString,
        day: date.getDate(),
        month: date.getMonth(),
        completed: streakDay ? streakDay.completed : null
      });
    }
    
    return calendarDays;
  };

  const calendarDays = generateCalendarGrid();

  function updateStreak(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          'translate-x-0'
        }`}
        style={{ top: '72px' }}
      >
        <div className="flex flex-col h-full">
          {/* App Logo - Removed since it's now in navbar */}
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-xl font-semibold">Menu</h2>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  item.label === 'Dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-5 border-t border-gray-800">
            <button className="flex items-center w-full p-3 text-gray-300 rounded-md hover:bg-gray-800 transition-colors">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-6" style={{ marginTop: '72px' }}>
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {username.split(' ')[0]}!</h1>
            <p className="text-gray-400 mt-1">Here's an overview of your learning journey</p>
          </motion.div>

          {/* Stats Summary */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Current Streak', value: `${streakData.currentStreak} days`, icon: Flame, color: 'text-orange-500' },
              { label: 'Level', value: `${userdata.level}`, icon: BarChart3, color: 'text-blue-500' },
              { label: 'Time Invested', value: '86 hours', icon: Clock, color: 'text-purple-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg p-5 flex items-center"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`p-3 rounded-full bg-gray-700 mr-4 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-xl font-semibold">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-8">
              {/* Current Learning Topics - Now first */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Current Learning Topics</h2>
                  <Link to="/learning" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                    All Topics <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {learningTopics.map((topic) => {
                    const progressColor = categoryColors[topic.category as keyof typeof categoryColors] || 'bg-blue-500';
                    
                    return (
                      <div 
                        key={topic.id}
                        className="bg-gray-800 p-5 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer shadow-md"
                        style={{ width: '100%', minHeight: '160px' }}
                      >
                        <div className="flex flex-col h-full">
                          <div className="mb-3">
                            <div className="flex justify-between items-center">
                              <span className={`px-2 py-0.5 rounded-md text-xs ${progressColor.replace('bg-', 'bg-opacity-20 text-')}`}>
                                {topic.category}
                              </span>
                              <span className="text-xs text-gray-400">{topic.difficulty}</span>
                            </div>
                            <h3 className="text-lg font-medium mt-2">{topic.title}</h3>
                          </div>
                          
                          <div className="mt-auto">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs text-gray-400">Progress</span>
                              <span className="text-sm font-medium">{topic.progress}%</span>
                            </div>
                            
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`${progressColor} h-full`} 
                                style={{ width: `${topic.progress}%` }}
                              ></div>
                            </div>
                            
                            <p className="text-sm text-gray-400 mt-2.5">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Interview History - Now second */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Interview Practice</h2>
                  <Link to="/history" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {interviewHistory.map((interview) => (
                    <Link 
                      key={interview.id}
                      to={`/analysis`}
                      className="bg-gray-800 p-4 rounded-lg hover:bg-gray-650 transition-colors cursor-pointer block"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{interview.title}</h3>
                          <p className="text-sm text-gray-400">{new Date(interview.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm mr-2">{interview.score}%</span>
                          <div 
                            className={`px-2 py-1 rounded-full text-xs 
                              ${interview.status === 'Completed' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}
                          >
                            {interview.status}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Keep the streak calendar */}
            <div className="space-y-8">
              {/* Streak Calendar */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Your Learning Streak</h2>
                
                <div className="flex justify-between mb-6">
                  <div className="text-center">
                    {/* Wrap the flame icon in a button to update the streak */}
                    <button onClick={updateStreak} className="focus:outline-none">
                      <div className="text-orange-500">
                        <Flame className="h-6 w-6 mx-auto" />
                      </div>
                    </button>
                    <p className="text-2xl font-bold">{streakData.currentStreak}</p>
                    <p className="text-xs text-gray-400">Current Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-500">
                      <Flame className="h-6 w-6 mx-auto" />
                    </div>
                    <p className="text-2xl font-bold">{streakData.longestStreak}</p>
                    <p className="text-xs text-gray-400">Longest Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="text-green-500">
                      <BookOpen className="h-6 w-6 mx-auto" />
                    </div>
                    <p className="text-2xl font-bold">{streakData.thisMonth}</p>
                    <p className="text-xs text-gray-400">This Month</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-2">Last 30 Days</div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, i) => {
                      // Force some days to have specific completion status for testing
                      let testCompleted = day.completed;
                      
                      // If initialStreakData is being used as fallback, force some dates to be completed for visual testing
                      if (day.date === new Date().toISOString().split('T')[0]) {
                        testCompleted = true; // Today is completed
                      }
                      
                      // Define color class based on completion status
                      let colorClass;
                      if (testCompleted === true) {
                        colorClass = "bg-green-600 text-white"; // More vibrant green for completed days
                      } else if (testCompleted === false) {
                        colorClass = "bg-red-600/30 text-red-100"; // Red for explicitly missed days
                      } else {
                        colorClass = "bg-gray-700/50 text-gray-400"; // Gray for days without data
                      }
                      
                      return (
                        <div 
                          key={i} 
                          className={`relative aspect-square rounded-sm flex items-center justify-center text-xs ${colorClass}`}
                        >
                          {day.day}
                          {testCompleted === true && (
                            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 bg-white rounded-full"></span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Recommended Learning Paths - Keep */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Recommended Learning Paths</h2>
                <div className="space-y-4">
                  {/* Keep existing recommended learning paths code */}
                  <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-650 transition-colors cursor-pointer">
                    <h3 className="font-medium">Frontend Developer Track</h3>
                    <div className="flex text-xs text-gray-400 mt-1">
                      <span>Intermediate</span>
                      <span className="mx-2">•</span>
                      <span>8 weeks</span>
                      <span className="mx-2">•</span>
                      <span>12 modules</span>
                    </div>
                    <button className="mt-3 text-sm bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 transition-colors">
                      Start Learning
                    </button>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-650 transition-colors cursor-pointer">
                    <h3 className="font-medium">Algorithms Mastery</h3>
                    <div className="flex text-xs text-gray-400 mt-1">
                      <span>Advanced</span>
                      <span className="mx-2">•</span>
                      <span>10 weeks</span>
                      <span className="mx-2">•</span>
                      <span>16 modules</span>
                    </div>
                    <button className="mt-3 text-sm bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 transition-colors">
                      Start Learning
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Continue Learning Section */}
          <motion.div variants={itemVariants} className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Continue where you left off</h2>
                <p className="text-gray-300 mt-1">{lastModule.title} - {lastModule.module}</p>
              </div>
              <button className="mt-4 md:mt-0 bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors">
                Resume Learning
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
