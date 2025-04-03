import React, { useState } from 'react';
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

interface RoadmapTile {
  id: string;
  title: string;
  description: string;
  progress: number;
}

interface CreateRoadmapForm {
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  experience: number;
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
  const form = useForm<CreateRoadmapForm>({
    defaultValues: {
      topic: "",
      level: "Beginner",
      experience: 0,
    },
  });

  const handleTileClick = (id: string) => {
    navigate(`/flow`);
  };

  const handleCreateRoadmap = (values: CreateRoadmapForm) => {
    alert('HI');
    console.log(values);
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
        
        <Dialog>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <Button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Create Roadmap
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {roadmapData.map((tile, index) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900 rounded-lg p-6 shadow-sm cursor-pointer border border-slate-800 text-white"
            onClick={() => handleTileClick(tile.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{tile.title}</h2>
            <p className="text-slate-400 mb-4">{tile.description}</p>
            <Progress.Root className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <Progress.Indicator
                className="h-full bg-green-600 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${100 - tile.progress}%)` }}
              />
            </Progress.Root>
            <div className="text-right mt-2 text-sm text-slate-400">
              {tile.progress}%
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Plans;
