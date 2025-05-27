"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Save } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StoryHeaderProps {
  wordCount: number;
  isSubmitting: boolean;
  title: string;
  genre: string;
  handleSubmit: (e: React.FormEvent) => void;
  setShowAITour: (show: boolean) => void;
}

export default function StoryHeader({
  wordCount,
  isSubmitting,
  title,
  genre,
  handleSubmit,
  setShowAITour,
}: StoryHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="header-container w-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
            Create a New Story
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {wordCount > 0
              ? `${wordCount} words`
              : "Start writing your masterpiece"}
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAITour(true)}
                  className="mr-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Learn how to use AI features
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title.trim() || !genre.trim()}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="opacity-25"
                          />
                          <path
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h-8z"
                            className="opacity-75"
                          />
                        </svg>
                        <span className="hidden sm:inline">Saving</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">Save</span>
                      </span>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {!title.trim() && !genre.trim()
                  ? "Please provide a title and select a genre to save your story."
                  : !title.trim()
                  ? "Please provide a title to save your story."
                  : !genre.trim()
                  ? "Please select a genre to save your story."
                  : "Save your story"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.header>
  );
}
