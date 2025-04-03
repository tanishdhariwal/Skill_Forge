import { Link } from 'react-router-dom';
import { Flame, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  // Removed hardcoded points; now use state:
  const [points, setPoints] = useState<number>(1);

  // NEW: Function to fetch points from API
  const fetchPoints = async () => {
    try {
      const response = await axios.get('/user/updateStreak');
      console.log(response.data); // Log the response for debugging
      // Assuming API returns { points: number }
      setPoints(response.data.longestStreak); // Update points with the longest streak
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900 border-b border-gray-800 py-4 px-6 flex items-center justify-between">
      {/* Logo on left */}
      <div className="flex items-center">
        <Link to="/dashboard" className="group">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
            SKILL GARAGE
          </h1>
        </Link>
      </div>

      {/* Right side flex container for battle button, points and avatar */}
      <div className="flex items-center space-x-4">
        {/* Battle button on the right */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
          Start a Battle
        </button>
        
        {/* Fire symbol with points - now clickable and links to Daily Question */}
        <Link to="/daily-question" className="block">
          <div className="flex items-center bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors">
            <Flame className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-white font-medium">{points}</span>
          </div>
        </Link>
        
        {/* Avatar linked to profile */}
        <Link to="/profile" className="block">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
