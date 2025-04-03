import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Progress from '@radix-ui/react-progress';
import { BookOpen, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { generateStudyPlan, getPlansTiles } from "../communications/studyPlanCommunications";

interface RoadmapTile {
  _id: string;
  title: string;
  description?: string;
  progress?: number;
}

interface CreateRoadmapForm {
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  experience: number;
}

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState<RoadmapTile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<CreateRoadmapForm>({
    defaultValues: {
      topic: "",
      level: "Beginner",
      experience: 0,
    },
  });

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setIsLoading(true);
    try {
      const data = await getPlansTiles();
      // Add progress property if not exists
      const enhancedData = data.map((tile: RoadmapTile) => ({
        ...tile,
        progress: tile.progress || Math.floor(Math.random() * 100), // Placeholder progress
        description: tile.description || "Click to view this learning roadmap"
      }));
      setRoadmapData(enhancedData);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTileClick = (id: string) => {
    navigate(`/flow`, { state: { planId: id } });
  };

  const handleCreateRoadmap = async (values: CreateRoadmapForm) => {
    setIsCreating(true);
    try {
      await generateStudyPlan(
        values.topic,
        values.level.toLowerCase(),
        values.experience
      );
      setIsDialogOpen(false);
      form.reset();
      // Refetch the roadmaps to include the newly created one
      await fetchRoadmaps();
    } catch (error) {
      console.error("Error creating roadmap:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 pt-20 mt-10 px-8"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold text-white flex items-center gap-2"
        >
          <BookOpen className="h-6 w-6" />
          Your Roadmaps
        </motion.h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-5 w-5 mr-2" />
              Create New Roadmap
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Roadmap</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateRoadmap)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Topic to learn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a topic..."
                          className="bg-slate-800 border-slate-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-slate-200">Your level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                            <div key={level} className="flex items-center space-x-3">
                              <RadioGroupItem 
                                value={level} 
                                id={level}
                                className="border-slate-700 text-green-500"
                              />
                              <Label 
                                htmlFor={level}
                                className="text-slate-200"
                              >
                                {level}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Months of experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="bg-slate-800 border-slate-700 text-white"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Roadmap"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-white py-10">Loading roadmaps...</div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {roadmapData.length > 0 ? (
            roadmapData.map((tile, index) => (
              <motion.div
                key={tile._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-900 rounded-lg p-6 shadow-sm cursor-pointer border border-slate-800 text-white"
                onClick={() => handleTileClick(tile._id)}
              >
                <h2 className="text-xl font-semibold mb-2">{tile.title}</h2>
                <p className="text-slate-400 mb-4">{tile.description}</p>
                <Progress.Root className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <Progress.Indicator
                    className="h-full bg-green-600 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${100 - (tile.progress || 0)}%)` }}
                  />
                </Progress.Root>
                <div className="text-right mt-2 text-sm text-slate-400">
                  {tile.progress}%
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center text-white py-10">
              No roadmaps found. Create one to get started!
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Plans;
