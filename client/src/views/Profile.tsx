import { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { Flame, Award, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "./Navbar";
// import { useAuth } from "@/context/AuthContext";

// Mock data for development
const userData = {
  username: "Ramesh",
  avatarUrl: "/avatars/01.png",
  badges: ["Interview Pro", "Study Master", "Consistency King", "SQL Expert"],
  interviewsTaken: 42,
  customStudyPlans: 7,
  currentStreak: 8,
  longestStreak: 15,
  roadmaps: [
    { id: 1, title: "SQL Mastery", progress: 75 },
    { id: 2, title: "React Advanced", progress: 60 },
    { id: 3, title: "Data Structures", progress: 30 },
    { id: 4, title: "System Design", progress: 45 },
  ]
};

// Function to generate activity data for the contribution graph
const generateActivityData = () => {
  const today = new Date();
  const activityData = [];
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random activity level (0-3)
    const activityLevel = Math.floor(Math.random() * 4);
    
    activityData.push({
      date: date.toISOString().split('T')[0],
      count: activityLevel
    });
  }
  
  return activityData.reverse();
};

// Component for each cell in the contribution graph
const ActivityCell = ({ count }: { count: number }) => {
  const getColorClass = () => {
    switch (count) {
      case 0: return "bg-slate-800";
      case 1: return "bg-green-900";
      case 2: return "bg-green-700";
      case 3: return "bg-green-500";
      default: return "bg-slate-800";
    }
  };
  
  return (
    <div 
      className={`w-3 h-3 rounded-sm ${getColorClass()} hover:ring-1 hover:ring-white`}
      title={`${count} activities on this day`}
    />
  );
};

// Contribution Graph Component
const ContributionGraph = () => {
  const [activityData, setActivityData] = useState<Array<{ date: string, count: number }>>([]);
  
  useEffect(() => {
    setActivityData(generateActivityData());
  }, []);
  
  // Group by week for display
  const weeks = [];
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7));
  }
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="text-lg font-semibold mb-2">Activity</div>
      <div className="grid grid-flow-col gap-1 py-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-flow-row gap-1">
            {week.map((day, dayIndex) => (
              <ActivityCell key={`${weekIndex}-${dayIndex}`} count={day.count} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-1 mr-2">
          <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
          <span>None</span>
        </div>
        <div className="flex items-center gap-1 mr-2">
          <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1 mr-2">
          <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

// CountUp component for counter animations
const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const controls = animate(0, end, {
      duration: 2,
      onUpdate: (latest) => setCount(Math.floor(latest))
    });
    return controls.stop;
  }, [end]);
  return <span>{count}</span>;
};

export const Profile = () => {
//   const { logout } = useAuth();
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-950 pt-16 text-white">
      {/* Profile Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="md:col-span-1">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={userData.avatarUrl} alt={userData.username} />
                      <AvatarFallback className="text-2xl">{userData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">{userData.username}</h2>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {userData.badges.map((badge, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Badge variant="outline" className="bg-slate-800 text-green-400 border-green-600">
                          <Award className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Statistics */}
            <Card className="bg-slate-900 border-slate-800 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-slate-800 p-2 rounded-md mr-3">
                        <BookOpen className="h-5 w-5 text-green-400" />
                      </div>
                      <span>Interviews Taken</span>
                    </div>
                    <span className="text-xl font-bold text-green-400">
                      <CountUp end={userData.interviewsTaken} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-slate-800 p-2 rounded-md mr-3">
                        <BookOpen className="h-5 w-5 text-green-400" />
                      </div>
                      <span>Custom Study Plans</span>
                    </div>
                    <span className="text-xl font-bold text-green-400">
                      <CountUp end={userData.customStudyPlans} />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak Section */}
            <Card className="bg-slate-900 border-slate-800 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Your Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Flame className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="text-sm text-slate-400">Current</span>
                    </div>
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.5 
                      }}
                      className="text-2xl font-bold text-orange-500"
                    >
                      {userData.currentStreak} days
                    </motion.div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Flame className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-sm text-slate-400">Longest</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-500">
                      {userData.longestStreak} days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button 
              variant="destructive" 
              className="w-full mt-6 bg-red-900 hover:bg-red-800"
            //   onClick={logout}
            >
              Logout
            </Button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Contribution Graph */}
            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardContent className="pt-6">
                <ContributionGraph />
              </CardContent>
            </Card>

            {/* Custom Roadmaps */}
            <h3 className="text-xl font-semibold mb-4">Your Study Plans</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userData.roadmaps.map((roadmap) => (
                <motion.div
                  key={roadmap.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{roadmap.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{roadmap.progress}%</span>
                        </div>
                        <Progress value={roadmap.progress} className="h-2 bg-slate-800" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-slate-900 mt-12 py-6 border-t border-slate-800">
        <div className="container bg-transparent mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 mb-4 md:mb-0">
              © 2024 Upskill. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Profile;
