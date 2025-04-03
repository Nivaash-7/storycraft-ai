"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Edit, BookOpen, PenSquare, CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Story {
  id: number;
  title: string;
  status: string;
  lastEdited: string;
  progress: number;
  wordCount: number;
  genre: string;
}

interface Activity {
  id: number;
  action: string;
  storyTitle: string;
  timestamp: string;
}

interface DashboardContentProps {
  firstName: string;
  stories: Story[];
  activities: Activity[];
}

export function DashboardContent({ firstName, stories, activities }: DashboardContentProps) {
  const [filter, setFilter] = useState<"all" | "Published" | "Started">("all");
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const totalWords = stories.reduce((sum, story) => sum + story.wordCount, 0);
  const completedStories = stories.filter((story) => story.status === "Published").length;
  const activeDrafts = stories.length - completedStories;

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.2, duration: 0.5, type: "spring" },
    }),
  };

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 sm:p-6 md:p-10 bg-background">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Unleash your creativity—continue your stories or embark on a new journey.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">Your Writing Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <motion.div custom={0} initial="hidden" animate="visible" variants={statVariants}>
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                  <PenSquare className="w-8 h-8 sm:w-10 sm:h-10" />
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold">{totalWords.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm opacity-80">Words Written</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={1} initial="hidden" animate="visible" variants={statVariants}>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold">{completedStories}</p>
                    <p className="text-xs sm:text-sm opacity-80">Stories Published</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={2} initial="hidden" animate="visible" variants={statVariants}>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold">{activeDrafts}</p>
                    <p className="text-xs sm:text-sm opacity-80">Active Drafts</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">Quick Start</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push("/create-story")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-sm sm:text-base cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Create a New Story
            </Button>
            {stories.length > 0 && (
              <Button
                onClick={() => router.push(`/edit-story/${stories[0].id}`)}
                variant="outline"
                className="flex items-center gap-2 hover:bg-muted text-sm sm:text-base cursor-pointer"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                Continue {stories[0].title}
              </Button>
            )}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-8">
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="shadow-lg bg-card border-border">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <CardTitle className="text-foreground text-lg sm:text-xl">Recent Activity</CardTitle>
                <div className="flex flex-wrap gap-2 overflow-x-auto sm:overflow-x-visible">
                  {(["all", "Published", "Started"] as const).map((type) => (
                    <Button
                      key={type}
                      variant={filter === type ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilter(type)}
                      className={cn(
                        "text-xs sm:text-sm",
                        filter === type
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted cursor-pointer"
                      )}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {activities.filter((a) => filter === "all" || a.action === filter).length > 0 ? (
                  <ul className="space-y-3">
                    {activities
                      .filter((a) => filter === "all" || a.action === filter)
                      .map((activity) => (
                        <motion.li
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
                        >
                          <span className="text-xs sm:text-sm text-muted-foreground">{activity.timestamp}</span>
                          <span className="text-foreground text-sm sm:text-base">
                            {activity.action} <strong>{activity.storyTitle}</strong>
                          </span>
                        </motion.li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm sm:text-base">No recent activity to display.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12"
        >
          <Card className="shadow-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Your Stories</CardTitle>
            </CardHeader>
            <CardContent>
              {stories.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {stories.map((story) => (
                    <motion.li
                      key={story.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-card rounded-lg shadow-md border border-border"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-foreground">{story.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {story.status} • {story.genre} • {story.wordCount.toLocaleString()} words
                          </p>
                          <p className="text-xs text-muted-foreground">Last Edited: {story.lastEdited}</p>
                        </div>
                        <Button
                          onClick={() => router.push(`/edit-story/${story.id}`)}
                          variant="ghost"
                          className="text-foreground hover:bg-muted cursor-pointer"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <Progress value={story.progress} className="flex-1" />
                        <span className="text-xs sm:text-sm text-muted-foreground">{story.progress}%</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base">No stories yet. Start your first one now!</p>
                  <Button
                    onClick={() => router.push("/create-story")}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-sm sm:text-base"
                  >
                    Start Writing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}