import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Progress from '@radix-ui/react-progress';
import { BookOpen } from 'lucide-react';
// import { cn } from '../lib/utils'; // You'll need to create this utility

interface RoadmapTile {
  id: string;
  title: string;
  description: string;
  progress: number;
}

const roadmapData: RoadmapTile[] = [
  {
    id: '1',
    title: 'Frontend Development',
    description: 'Master modern frontend technologies and frameworks',
    progress: 75
  },
  {
    id: '2',
    title: 'Backend Development',
    description: 'Learn server-side programming and databases',
    progress: 45
  },
  {
    id: '3',
    title: 'DevOps',
    description: 'Understand deployment, CI/CD, and cloud services',
    progress: 30
  }
];

const Plans: React.FC = () => {
  const navigate = useNavigate();

  const handleTileClick = (id: string) => {
    navigate(`/flowchart/${id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        Your Roadmaps
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmapData.map((tile) => (
          <div
            key={tile.id}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleTileClick(tile.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{tile.title}</h2>
            <p className="text-gray-600 mb-4">{tile.description}</p>
            <Progress.Root className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <Progress.Indicator
                className="h-full bg-blue-600 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${100 - tile.progress}%)` }}
              />
            </Progress.Root>
            <div className="text-right mt-2 text-sm text-gray-600">
              {tile.progress}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
