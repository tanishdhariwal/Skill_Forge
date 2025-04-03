import { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { Flame, Award, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";

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
  const { logout } = useAuth();
  return (
    <>
    {/* <Navbar /> */}
    <div className="min-h-screen bg-slate-950 pt-16 text-white">
      {/* Profile Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info - Now using one column */}
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
              onClick={logout}
            >
              Logout
            </Button>
          </div>

          {/* Main Content - Now spans 2 columns */}
          <div className="md:col-span-2">
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

            {/* Added: Additional stats or info section to fill the space */}
            <div className="mt-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">Learning Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h4 className="font-medium mb-2">Strongest Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-md text-sm">SQL</span>
                        <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-md text-sm">React</span>
                        <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded-md text-sm">JavaScript</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h4 className="font-medium mb-2">Focus Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-amber-900/30 text-amber-400 rounded-md text-sm">System Design</span>
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-md text-sm">Algorithms</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Added: Recent achievements section */}
            <div className="mt-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center p-2 bg-slate-800 rounded-md">
                      <div className="h-8 w-8 rounded-full bg-green-900/40 flex items-center justify-center mr-3">
                        <Award className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Completed React Advanced Course</p>
                        <p className="text-sm text-slate-400">Last week</p>
                      </div>
                    </li>
                    <li className="flex items-center p-2 bg-slate-800 rounded-md">
                      <div className="h-8 w-8 rounded-full bg-blue-900/40 flex items-center justify-center mr-3">
                        <Flame className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">7-Day Streak Milestone</p>
                        <p className="text-sm text-slate-400">2 days ago</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
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
