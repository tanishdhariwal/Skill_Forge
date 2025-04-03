import { Link } from 'react-router-dom';
import { Flame, User } from 'lucide-react';

const Navbar = () => {
  // Hardcoded values instead of props
  const points = 350;
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900 border-b border-gray-800 py-4 px-6 flex items-center justify-between">
      {/* Logo on left */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">UP SKILL</h1>
      </div>

      {/* Right side flex container for battle button, points and avatar */}
      <div className="flex items-center space-x-4">
        {/* Battle button on the right */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
          Start a Battle
        </button>
        
        {/* Fire symbol with points */}
        <div className="flex items-center bg-gray-800 px-3 py-1.5 rounded-full">
          <Flame className="h-5 w-5 text-orange-500 mr-2" />
          <span className="text-white font-medium">{points}</span>
        </div>
        
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
