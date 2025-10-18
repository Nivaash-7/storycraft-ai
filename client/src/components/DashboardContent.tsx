"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PlusCircle,
  Edit,
  BookOpen,
  PenSquare,
  CheckCircle,
  FileText,
  Trash2,
  Clock,
  BookMarked,
  Sparkles,
  Calendar,
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { toast, Toaster } from "sonner"

interface Story {
  id: string
  title: string
  status: string
  lastEdited: string
  wordCount: number
  genre: string
}

interface Activity {
  id: string
  action: string
  storyTitle: string
  timestamp: string
}

interface DashboardContentProps {
  firstName: string
  stories: Story[]
  activities: Activity[]
}

export default function DashboardContent({ firstName, stories: initialStories, activities }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all")
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<{
    id: string
    title: string
  } | null>(null)
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const theme = savedTheme || (prefersDark ? "dark" : "light")

    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleDeleteStory = (storyId: string, storyTitle: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a story.")
      return
    }
    setStoryToDelete({ id: storyId, title: storyTitle })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!storyToDelete || !user) return

    try {
      const response = await fetch(`/api/stories/${storyToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete story")
      }

      setStories((prevStories) => prevStories.filter((story) => story.id !== storyToDelete.id))
      toast.success("Story deleted successfully!")
    } catch (error) {
      console.error("Error deleting story:", error)
      toast.error("Failed to delete story. Please try again.")
    } finally {
      setDeleteDialogOpen(false)
      setStoryToDelete(null)
    }
  }

  const totalWords = stories.reduce((sum, story) => sum + story.wordCount, 0)
  const completedStories = stories.filter((story) => story.status === "Published").length
  const activeDrafts = stories.length - completedStories

  const filteredStories = stories.filter((story) => {
    if (activeTab === "all") return true
    if (activeTab === "published") return story.status === "Published"
    if (activeTab === "draft") return story.status === "Draft"
    return true
  })

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.4, type: "spring" },
    }),
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="flex flex-1 bg-background min-h-screen">
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          },
        }}
      />
      <div className="flex h-full w-full flex-1 flex-col gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 lg:p-8 bg-background">
        {/* Welcome back section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 md:mb-6 lg:mb-8"
        >
          <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance">
                Welcome back,{" "}
                <span className="bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {firstName}!
                </span>
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-foreground/80 max-w-2xl text-balance">
                Unleash your creativity—continue your stories or embark on a new journey. Your writing adventure awaits.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Your Writing Journey section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
            Your Writing Journey
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <motion.div custom={0} variants={statVariants} initial="hidden" animate="visible">
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider">
                        Total Words
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold mt-1">{totalWords.toLocaleString()}</p>
                    </div>
                    <div className="rounded-full bg-white/20 p-2 sm:p-3 backdrop-blur-sm flex-shrink-0">
                      <PenSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-white/90">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Keep writing to reach your goals!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={1} variants={statVariants} initial="hidden" animate="visible">
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider">
                        Published Stories
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold mt-1">{completedStories}</p>
                    </div>
                    <div className="rounded-full bg-white/20 p-2 sm:p-3 backdrop-blur-sm flex-shrink-0">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-white/90">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <BookMarked className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>
                        {completedStories > 0 ? "Great work publishing your stories!" : "Publish your first story!"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={2} variants={statVariants} initial="hidden" animate="visible">
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-green-200/50 dark:hover:shadow-green-900/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider">
                        Active Drafts
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold mt-1">{activeDrafts}</p>
                    </div>
                    <div className="rounded-full bg-white/20 p-2 sm:p-3 backdrop-blur-sm flex-shrink-0">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-white/90">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{activeDrafts > 0 ? "Continue developing your ideas!" : "Start your first draft!"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Quick Start section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4 sm:mb-6">Quick Start</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={() => router.push("/create-story")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium cursor-pointer w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a New Story
            </Button>
            {stories.length > 0 && (
              <Button
                onClick={() => router.push(`/edit-story/${stories[0].id}`)}
                variant="outline"
                className="bg-transparent border text-foreground cursor-pointer w-full sm:w-auto"
              >
                <Edit className="mr-2 h-4 w-4" />
                Continue {stories[0].title}
              </Button>
            )}
          </div>
        </motion.section>

        {/* Recent Activity and Your Stories sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.section variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-1">
            <Card className="h-full shadow-md bg-card border-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg md:text-xl text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">Recent Activity</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                  Your latest writing actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
                  {activities.length > 0 ? (
                    <ul className="space-y-2 sm:space-y-3">
                      {activities.map((activity) => (
                        <motion.li
                          key={activity.id}
                          variants={itemVariants}
                          className="flex flex-col gap-1 rounded-lg border border-border/50 p-2 sm:p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-medium flex-shrink-0",
                                activity.action === "Published"
                                  ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                  : "bg-green-500/10 text-green-500 border-green-500/20",
                              )}
                            >
                              {activity.action}
                            </Badge>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {activity.timestamp}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-foreground mt-1 truncate">
                            {activity.storyTitle}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                      <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                      <p className="text-xs sm:text-sm text-muted-foreground text-center">
                        No recent activity to display.
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Start writing to see your activity here!
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-2">
            <Card className="shadow-md bg-card border-border h-full">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl text-foreground flex items-center gap-2">
                    <BookMarked className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">Your Stories</span>
                  </CardTitle>
                  <Tabs
                    defaultValue="all"
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "all" | "published" | "draft")}
                    className="w-full sm:w-auto"
                  >
                    <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                      <TabsTrigger
                        value="all"
                        className={cn(
                          activeTab === "all"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm"
                            : "text-foreground cursor-pointer text-xs sm:text-sm",
                        )}
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="published"
                        className={cn(
                          activeTab === "published"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm"
                            : "text-foreground cursor-pointer text-xs sm:text-sm",
                        )}
                      >
                        Published
                      </TabsTrigger>
                      <TabsTrigger
                        value="draft"
                        className={cn(
                          activeTab === "draft"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm"
                            : "text-foreground cursor-pointer text-xs sm:text-sm",
                        )}
                      >
                        Drafts
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
                  {filteredStories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {filteredStories.map((story) => (
                        <motion.div
                          key={story.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          className="group relative overflow-hidden rounded-lg border border-border/50 bg-card transition-all hover:shadow-md"
                        >
                          <div
                            className="absolute top-0 left-0 h-full w-1 sm:w-1.5"
                            style={{
                              backgroundColor: story.status === "Published" ? "#9333EA" : "#32CD32",
                            }}
                          ></div>
                          <div className="p-3 sm:p-4 pl-4 sm:pl-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                              <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-foreground transition-colors truncate">
                                  {story.title}
                                </h3>
                                <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      "text-xs font-medium flex-shrink-0",
                                      story.status === "Published"
                                        ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                        : "bg-green-500/10 text-green-500 border-green-500/20",
                                    )}
                                  >
                                    {story.status}
                                  </Badge>
                                  <span className="flex items-center gap-1 flex-shrink-0">
                                    <PenSquare className="h-3 w-3" />
                                    {story.wordCount.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1 flex-shrink-0">
                                    <Calendar className="h-3 w-3" />
                                    {story.lastEdited}
                                  </span>
                                  {story.genre && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs text-foreground border-border flex-shrink-0"
                                    >
                                      {story.genre}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto flex-shrink-0">
                                <Button
                                  onClick={() => router.push(`/edit-story/${story.id}`)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-foreground hover:bg-transparent cursor-pointer transition-colors h-8 w-8 sm:h-9 sm:w-auto sm:px-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only sm:not-sr-only sm:ml-2">Edit</span>
                                </Button>
                                <Button
                                  onClick={() => handleDeleteStory(story.id, story.title)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:bg-transparent cursor-pointer transition-colors h-8 w-8 sm:h-9 sm:w-auto sm:px-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only sm:not-sr-only sm:ml-2">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                      <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                      <p className="text-xs sm:text-sm text-muted-foreground text-center">No stories found.</p>
                      {activeTab !== "all" ? (
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Try switching to a different tab or create a new story.
                        </p>
                      ) : (
                        <Button
                          onClick={() => router.push("/create-story")}
                          className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Start Writing
                        </Button>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md bg-card text-foreground border-border rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">Delete Story</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Are you sure you want to delete <strong>{storyToDelete?.title}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setStoryToDelete(null)
                }}
                className="w-full sm:w-auto bg-transparent text-foreground border-border hover:bg-muted cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="w-full sm:w-auto bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
