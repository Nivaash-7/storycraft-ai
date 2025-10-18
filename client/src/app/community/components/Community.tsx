"use client";

import { useState, useEffect, useRef } from "react";
import type React from "react";

import {
  Search,
  Heart,
  Filter,
  BookOpen,
  Share2,
  Clock,
  TrendingUp,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
  Eye,
  Users,
  Zap,
  MessageSquare,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { ModernSidebar } from "@/components/ModernSidebar";
import { Story } from "@/lib/models";
import { ObjectId } from "mongodb";

const genres = [
  "All Genres",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Horror",
  "Adventure",
  "Thriller",
];

const toIdString = (id: string | ObjectId): string =>
  typeof id === "string" ? id : id.toString();

const formatDate = (date?: string | Date): string => {
  if (!date) return "Unknown date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

interface CommunityProps {
  stories: Story[];
  loading: boolean;
  error: string | null;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}

const Community = ({ stories, loading, error, setStories }: CommunityProps) => {
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedStories, setExpandedStories] = useState<Set<string>>(
    new Set()
  );
  const [showingDescription, setShowingDescription] = useState<Set<string>>(
    new Set()
  );
  const [showingComments, setShowingComments] = useState<Set<string>>(
    new Set()
  );
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let filtered = stories;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (story) =>
          (story.title?.toLowerCase() || "").includes(lowerSearch) ||
          (story.description?.toLowerCase() || "").includes(lowerSearch) ||
          (story.author?.username?.toLowerCase() || "").includes(lowerSearch)
      );
    }
    if (selectedGenre !== "All Genres") {
      filtered = filtered.filter((story) => story.genre === selectedGenre);
    }
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt ?? "").getTime() -
            new Date(a.publishedAt ?? "").getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt ?? "").getTime() -
            new Date(b.publishedAt ?? "").getTime()
          );
        case "most_liked":
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        case "word_count":
          return (b.wordCount ?? 0) - (a.wordCount ?? 0);
        default:
          return 0;
      }
    });
    setFilteredStories(filtered);
  }, [stories, searchTerm, selectedGenre, sortBy]);

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

  const handleLike = async (storyId: string) => {
    if (!user) {
      toast.error("Please sign in to like a story.");
      return;
    }

    saveScrollPosition(storyId);

    try {
      const story = stories.find((s) => toIdString(s._id) === storyId);
      if (!story) {
        toast.error("Story not found.");
        return;
      }

      const isLiked = story?.likes.some((id) => toIdString(id) === user.id);

      const response = await fetch(`/api/stories/${storyId}/like`, {
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
        console.error("API error response:", await response.text());
        throw new Error("Failed to update like");
      }

      const updatedStory = await response.json();

      const oldStory = stories.find((s) => toIdString(s._id) === storyId);
      const mergedStory = {
        ...updatedStory,
        author: updatedStory.author || oldStory?.author,
      };

      setStories((prev) =>
        prev.map((s) => (toIdString(s._id) === storyId ? mergedStory : s))
      );

      toast.success(isLiked ? "Story unliked." : "Story liked!");
      setTimeout(() => restoreScrollPosition(storyId), 100);
    } catch (err) {
      console.error("Error updating like:", err);
      toast.error("Failed to update like. Please try again.");
    }
  };

  const handleShare = async (storyId: string) => {
    saveScrollPosition(storyId);
    const story = stories.find((s) => toIdString(s._id) === storyId);
    if (navigator.share) {
      try {
        await navigator.share({
          title: story?.title || "Check out this story!",
          text: `${
            story?.description ||
            `A great story by ${story?.author?.username || "Anonymous"}`
          }\nRead more here:`,
          url: window.location.origin + `/story/${storyId}`,
        });
        toast.success("Story shared successfully!");
      } catch (err) {
        console.error("Error sharing story:", err);
        toast.error("Failed to share. Please try again.");
      }
    } else {
      toast.error("Share functionality is not supported in this browser.");
      navigator.clipboard.writeText(
        window.location.origin + `/story/${storyId}`
      );
      toast.success("Story URL copied to clipboard!");
    }
    setTimeout(() => restoreScrollPosition(storyId), 100);
  };

  const toggleSetItem = (set: Set<string>, id: string): Set<string> => {
    const newSet = new Set(set);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    return newSet;
  };

  const toggleStoryExpansion = (storyId: string) => {
    saveScrollPosition(storyId);
    setExpandedStories((prev) => toggleSetItem(prev, storyId));
    setTimeout(() => restoreScrollPosition(storyId), 100);
  };

  const toggleDescription = (storyId: string) => {
    saveScrollPosition(storyId);
    setShowingDescription((prev) => toggleSetItem(prev, storyId));
    setTimeout(() => restoreScrollPosition(storyId), 100);
  };

  const toggleComments = (storyId: string) => {
    saveScrollPosition(storyId);
    setShowingComments((prev) => toggleSetItem(prev, storyId));
    setTimeout(() => restoreScrollPosition(storyId), 100);
  };

  const calculateReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const StoryCard = ({ story }: { story: Story }) => {
    const idStr = toIdString(story._id);
    const isExpanded = expandedStories.has(idStr);
    const showingDesc = showingDescription.has(idStr);
    const showingComms = showingComments.has(idStr);
    const previewLength = 300;
    const readingTime = calculateReadingTime(story.wordCount ?? 0);
    const [commentInput, setCommentInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);
    const commentSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          showingComms &&
          commentSectionRef.current &&
          !commentSectionRef.current.contains(event.target as Node) &&
          storyRef.current &&
          !storyRef.current.contains(event.target as Node)
        ) {
          saveScrollPosition(idStr);
          setShowingComments((prev) => {
            const newSet = new Set(prev);
            newSet.delete(idStr);
            return newSet;
          });
          setTimeout(() => restoreScrollPosition(idStr), 100);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [showingComms, idStr]);

    const handleCommentSubmit = async () => {
      if (!user) {
        toast.error("Please sign in to comment on a story.");
        return;
      }

      const commentContentTrimmed = commentInput.trim();
      if (!commentContentTrimmed) {
        toast.error("Comment cannot be empty.");
        return;
      }

      saveScrollPosition(toIdString(story._id));

      try {
        const response = await fetch(
          `/api/stories/${toIdString(story._id)}/comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              username: user.firstName || user.username || "Anonymous",
              avatar: user.imageUrl || null,
              content: commentContentTrimmed,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        const updatedStory = await response.json();

        const oldStory = stories.find(
          (s) => toIdString(s._id) === toIdString(updatedStory._id)
        );

        const mergedStory = {
          ...updatedStory,
          author: updatedStory.author || oldStory?.author,
        };

        setStories((prev) =>
          prev.map((s) =>
            toIdString(s._id) === toIdString(updatedStory._id) ? mergedStory : s
          )
        );

        setCommentInput("");
        toast.success("Comment added successfully!");
        setShowingComments((prev) => new Set(prev).add(toIdString(story._id)));
        setTimeout(() => restoreScrollPosition(toIdString(story._id)), 100);
      } catch (err) {
        console.error("Error adding comment:", err);
        toast.error("Failed to add comment. Please try again.");
      }
    };

    return (
      <TooltipProvider>
        <Card
          ref={storyRef}
          className="group hover:shadow-xl transition-all duration-300 border border-border/50 shadow-md bg-background hover:border-primary/20 mb-6 overflow-hidden"
        >
          <CardHeader className="space-y-4 pb-4 bg-background">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4 flex-1">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <AvatarImage
                    src={story.author?.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {story.author?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                          {story.author?.username || "Anonymous"}
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
                            This story is trending with {story.likes.length}{" "}
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
                          <Clock className="h-3 w-3" />
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
                          <BookOpen className="h-3 w-3" />
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
                          Estimated reading time based on {story.wordCount}{" "}
                          words
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
                    onClick={() => toggleDescription(idStr)}
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

          <CardContent className="space-y-4 pb-4">
            <h2 className="text-pretty text-xl font-bold text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
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

            <div className="prose prose-lg max-w-none">
              <div
                className="text-foreground leading-relaxed whitespace-pre-wrap"
                style={{
                  lineHeight: "1.7",
                  fontSize: "16px",
                  fontFamily:
                    'var(--font-montserrat), Georgia, "Times New Roman", serif',
                }}
              >
                {isExpanded
                  ? story.content || "No content available"
                  : (story.content || "No content available").slice(
                      0,
                      previewLength
                    ) +
                    ((story.content || "").length > previewLength ? "..." : "")}
              </div>
            </div>

            {(story.content || "").length > previewLength && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStoryExpansion(idStr)}
                    className="self-start text-primary p-0 h-auto font-medium transition-all cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Read more
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isExpanded ? "Collapse" : "Expand"} story content</p>
                </TooltipContent>
              </Tooltip>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col items-start gap-4 pt-4 pb-4">
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(idStr)}
                      className={`transition-all cursor-pointer ${
                        user?.id &&
                        story.likes?.some((id) => toIdString(id) === user.id)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          user?.id &&
                          story.likes?.some((id) => toIdString(id) === user.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {story.likes?.length ?? 0}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {user?.id &&
                      story.likes?.some((id) => toIdString(id) === user.id)
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
                      onClick={() => toggleComments(idStr)}
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
                      <Users className="h-4 w-4" />
                      <span>
                        {(story.likes?.length || 0) +
                          (story.comments?.length || 0)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Total engagement:{" "}
                      {(story.likes?.length || 0) +
                        (story.comments?.length || 0)}{" "}
                      interactions
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      onClick={() => handleShare(idStr)}
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
                  ref={commentSectionRef}
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
                            {user?.firstName?.[0]?.toUpperCase() || "U"}
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
                            key={toIdString(comment._id)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-background border border-border/50 rounded-lg p-3 hover:border-primary/20 transition-colors"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage
                                  src={comment.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                  {comment.username &&
                                  comment.username.length > 0
                                    ? comment.username[0].toUpperCase()
                                    : "U"}
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
                            No comments yet. Be the first to share your
                            thoughts!
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

  if (loading) {
    return (
      <ModernSidebar>
        <div ref={scrollRef} className="w-full max-w-7xl mx-auto px-2 py-8">
          <header className="mb-8 space-y-2">
            <h1 className="text-pretty text-4xl font-bold text-primary">
              Community Stories{" "}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Discover new voices and connect with fellow writers while we load
              the latest updates.
            </p>
          </header>
          <div className="space-y-6">
            <Card className="animate-pulse border border-border sticky top-4 z-10 bg-card/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 h-12 bg-muted rounded-xl" />
                  <div className="flex gap-3">
                    <div className="w-40 h-12 bg-muted rounded-xl" />
                    <div className="w-40 h-12 bg-muted rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border border-border">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ModernSidebar>
    );
  }

  return (
    <ModernSidebar>
      <div ref={scrollRef} className="w-full max-w-7xl mx-auto px-2 py-8">
        <header className="mb-8 space-y-2">
          <h1 className="text-pretty text-4xl font-bold text-primary">
            Community Stories{" "}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Dive into stories from our community, share your thoughts, and stay
            inspired together.
          </p>
        </header>
        <Card className="border border-border shadow-lg bg-background backdrop-blur-sm mb-8 sticky top-4 z-10 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    placeholder="Search stories, authors, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 h-12 text-base border-2 border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-lg z-10 cursor-pointer"
                    >
                      ×
                    </Button>
                  )}
                </div>
                {searchTerm && (
                  <p className="text-sm text-muted-foreground mt-2 ml-1">
                    {filteredStories.length} result
                    {filteredStories.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-row lg:gap-3">
                <div className="flex-1 lg:flex-none lg:w-44">
                  <Select
                    value={selectedGenre}
                    onValueChange={setSelectedGenre}
                  >
                    <SelectTrigger className="h-12 border-2 border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-border/50 bg-card/95 backdrop-blur-sm">
                      {genres.map((genre) => (
                        <SelectItem
                          key={genre}
                          value={genre}
                          className="rounded-lg cursor-pointer"
                        >
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 lg:flex-none lg:w-44">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12 border-2 border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-border/50 bg-card/95 backdrop-blur-sm">
                      <SelectItem
                        value="newest"
                        className="rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Newest First
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="oldest"
                        className="rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Oldest First
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="most_liked"
                        className="rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Most Liked
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="word_count"
                        className="rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Longest Stories
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {(searchTerm || selectedGenre !== "All Genres") && (
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>
                      Showing {filteredStories.length} of {stories.length}{" "}
                      stories
                    </span>
                  </div>
                  {(searchTerm || selectedGenre !== "All Genres") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedGenre("All Genres");
                      }}
                      className="text-primary h-8 px-3 rounded-lg cursor-pointer self-start md:self-auto"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          {error && (
            <Card className="border border-destructive/50 shadow-sm bg-card mb-8">
              <CardContent className="p-8 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="border-destructive/20 text-destructive hover:bg-transparent transition-colors cursor-pointer"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {filteredStories.length === 0 && !error ? (
            <Card className="border border-border shadow-sm bg-card">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No stories found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="border-primary/20 text-primary hover:bg-transparent cursor-pointer"
                  >
                    Clear search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredStories.map((story) => (
                <StoryCard key={toIdString(story._id)} story={story} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ModernSidebar>
  );
};

export default Community;
