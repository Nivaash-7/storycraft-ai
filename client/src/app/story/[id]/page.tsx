"use client";

import { useState, useEffect, useRef } from "react";
import type React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  Eye,
  ArrowLeft,
  MessageSquare,
  Send,
  Calendar,
  FileText,
  TrendingUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModernSidebar } from "@/components/ModernSidebar";

type Story = {
  _id: string;
  title: string;
  description: string;
  content: string;
  genre: string;
  author: {
    username: string;
    avatar?: string;
  };
  publishedAt: string | Date;
  likes: string[];
  wordCount: number;
  comments: {
    _id: string;
    userId: string;
    username: string;
    content: string;
    createdAt: string | Date;
  }[];
};

const StoryCard = ({
  story,
  user,
  handleLike,
  handleShare,
  setStory,
}: {
  story: Story;
  user: UserResource | null;
  handleLike: () => Promise<void>;
  handleShare: () => Promise<void>;
  setStory: React.Dispatch<React.SetStateAction<Story | null>>;
}) => {
  const [showingDescription, setShowingDescription] = useState<Set<string>>(
    new Set()
  );
  const [showingComments, setShowingComments] = useState<Set<string>>(
    new Set()
  );
  const [commentInput, setCommentInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showingComments.has(story._id) &&
        commentsRef.current &&
        !commentsRef.current.contains(event.target as Node)
      ) {
        setShowingComments((prev: Set<string>) => {
          const newSet = new Set(prev);
          newSet.delete(story._id);
          return newSet;
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showingComments, story._id]);

  const saveScrollPosition = (storyId: string) => {
    if (scrollRef.current) {
      scrollPositions.current.set(storyId, scrollRef.current.scrollTop);
    }
  };

  const restoreScrollPosition = (storyId: string) => {
    const position = scrollPositions.current.get(storyId);
    if (scrollRef.current && position !== undefined) {
      scrollRef.current.scrollTo({ top: position, behavior: "smooth" });
    }
  };

  const toggleDescription = (storyId: string) => {
    saveScrollPosition(storyId);
    setShowingDescription((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
    setTimeout(() => restoreScrollPosition(storyId), 0);
  };

  const toggleComments = (storyId: string) => {
    saveScrollPosition(storyId);
    setShowingComments((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
    setTimeout(() => restoreScrollPosition(storyId), 0);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const calculateReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to comment on a story.");
      return;
    }
    const commentContent = commentInput.trim();
    if (!commentContent) {
      toast.error("Comment cannot be empty.");
      return;
    }
    saveScrollPosition(story._id);
    try {
      const response = await fetch(`/api/stories/${story._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          username: user.firstName,
          content: commentContent,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const updatedStory = await response.json();
      setStory(updatedStory);
      setCommentInput("");
      toast.success("Comment added successfully!");
      setShowingComments((prev: Set<string>) => new Set(prev).add(story._id));
      if (textareaRef.current) {
        textareaRef.current.focus({ preventScroll: true });
      }
      setTimeout(() => restoreScrollPosition(story._id), 0);
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const showingDesc = showingDescription.has(story._id);
  const showingComms = showingComments.has(story._id);
  const readingTime = calculateReadingTime(story.wordCount ?? 0);

  return (
    <TooltipProvider>
      <Card className="group hover:shadow-xl transition-all duration-300 border border-border/50 shadow-md bg-background hover:border-primary/20 mb-6 overflow-hidden h-full flex flex-col">
        <CardHeader className="space-y-4 pb-4 bg-background from-card to-muted/20 flex-shrink-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4 flex-1">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                <AvatarImage src={story.author?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {story.author?.username?.[0]?.toUpperCase() || "W"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                        {story.author?.username || "Anonymous Writer"}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View author profile</p>
                    </TooltipContent>
                  </Tooltip>
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
                  >
                    {story.genre || "Unknown"}
                  </Badge>
                  {(story.likes?.length || 0) > 10 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium bg-secondary/10 text-secondary border-secondary/20"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          This story is trending with {story.likes?.length}{" "}
                          likes!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(story.publishedAt)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Published on {formatDate(story.publishedAt)}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>
                          {(story.wordCount ?? 0).toLocaleString()} words
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Approximately {readingTime} minute
                        {readingTime !== 1 ? "s" : ""} read
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{readingTime} min read</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Estimated reading time based on {story.wordCount} words
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleDescription(story._id)}
                  className="text-muted-foreground hover:text-primary transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showingDesc ? "Hide" : "Show"} story information</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-4 flex-1 overflow-hidden flex flex-col">
          <h2 className="text-pretty text-primary text-2xl font-bold leading-tight hover:text-primary transition-colors cursor-pointer">
            {story.title || "Untitled"}
          </h2>

          <AnimatePresence>
            {showingDesc && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-primary/5 border border-primary/20 p-4 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      About this story
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {story.description || "No description available"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="prose prose-lg max-w-none flex-1 overflow-hidden">
            <div
              ref={scrollRef}
              className="text-foreground leading-relaxed whitespace-pre-wrap h-full overflow-y-auto pr-2"
              style={{
                lineHeight: "1.7",
                fontSize: "16px",
                fontFamily:
                  'var(--font-montserrat), Georgia, "Times New Roman", serif',
              }}
            >
              {story.content || "No content available"}
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col items-start gap-4 pt-4 pb-4 flex-shrink-0">
          <div className="flex flex-wrap items-center justify-between w-full gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`transition-all cursor-pointer ${
                      user?.id && story.likes?.includes(user.id)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        user?.id && story.likes?.includes(user.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    {story.likes?.length ?? 0}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {user?.id && story.likes?.includes(user.id)
                      ? "Unlike"
                      : "Like"}{" "}
                    this story
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    onClick={() => toggleComments(story._id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {story.comments?.length ?? 0}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showingComms ? "Hide" : "Show"} comments</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm cursor-pointer">
                    <Eye className="h-4 w-4" />
                    <span>{story.likes?.length + story.comments?.length}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Total engagement:{" "}
                    {story.likes?.length + story.comments?.length} interactions
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this story</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <AnimatePresence>
            {showingComms && (
              <motion.div
                ref={commentsRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="bg-muted/30 border border-border/50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">
                      Comments ({story.comments?.length || 0})
                    </h4>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-3 space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={user?.imageUrl || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user?.firstName?.[0]?.toUpperCase() || "Anonymous"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          ref={textareaRef}
                          placeholder="Share your thoughts about this story..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleCommentSubmit();
                            }
                          }}
                          className="border-border focus:border-primary transition-colors resize-none min-h-[80px]"
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleCommentSubmit}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 cursor-pointer"
                            disabled={!commentInput.trim()}
                            size="sm"
                          >
                            <Send className="h-3 w-3 mr-2" />
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 space-y-3 max-h-40 sm:max-h-48 overflow-y-auto">
                    {story.comments?.length ? (
                      story.comments.map((comment, index) => (
                        <motion.div
                          key={comment._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-background border border-border/50 rounded-lg p-3 hover:border-primary/20 transition-colors"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                {comment.username[0]?.toUpperCase() || "Anonymous"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground">
                                  {comment.username}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed break-words">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">
                          No comments yet. Be the first to share your thoughts!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default function StoryViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stories/${params.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch story: ${response.status}`);
        }
        const data = await response.json();
        setStory(data);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError("Failed to load story. Please try again.");
        toast.error("Failed to load story. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  const handleLike = async () => {
    if (!user || !story) {
      toast.error("Please sign in to like this story.");
      return;
    }
    try {
      const isLiked = story.likes.includes(user.id);
      const response = await fetch(`/api/stories/${story._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          action: isLiked ? "unlike" : "like",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update like");
      }
      const updatedStory = await response.json();
      setStory(updatedStory);
      toast.success(isLiked ? "Story unliked." : "Story liked!");
    } catch (err) {
      console.error("Error updating like:", err);
      toast.error("Failed to update like. Please try again.");
    }
  };

  const handleShare = async () => {
    if (!story) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title || "Check out this story!",
          text: `${
            story.description || `A great story by ${story.author?.username}`
          }\nRead more here:`,
          url: window.location.href,
        });
        toast.success("Story shared successfully!");
      } catch (err) {
        console.error("Error sharing story:", err);
        toast.error("Failed to share. Please try again.");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Story URL copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <ModernSidebar>
        <div className="h-screen overflow-hidden bg-background">
          <div className="max-w-7xl mx-auto px-4 py-4 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Story View Page
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              Explore and engage with your favorite stories in detail
            </p>
            <div className="flex-1 overflow-hidden">
              <Card className="animate-pulse border border-border h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 h-full">
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ModernSidebar>
    );
  }

  if (error || !story) {
    return (
      <ModernSidebar>
        <div className="h-screen overflow-hidden bg-background">
          <div className="max-w-7xl mx-auto px-4 py-4 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Story View Page
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              Explore and engage with your favorite stories in detail
            </p>
            <div className="flex-1 overflow-hidden">
              <Card className="border border-destructive/50 shadow-sm bg-card h-full">
                <CardContent className="p-8 text-center">
                  <p className="text-destructive mb-4">
                    {error || "Story not found"}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => router.back()}
                      className="border-primary/20 text-primary hover:bg-primary/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="border-destructive/20 text-destructive hover:bg-destructive/10"
                    >
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ModernSidebar>
    );
  }

  return (
    <ModernSidebar>
      <TooltipProvider>
        <div className="h-screen overflow-hidden bg-background">
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
          <div className="max-w-7xl mx-auto px-4 py-4 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Story View Page
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              Explore and engage with your favorite stories in detail
            </p>
            <div className="flex-1 overflow-hidden">
              <div className="h-full">
                <StoryCard
                  story={story}
                  user={user ?? null}
                  handleLike={handleLike}
                  handleShare={handleShare}
                  setStory={setStory}
                />
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </ModernSidebar>
  );
}
