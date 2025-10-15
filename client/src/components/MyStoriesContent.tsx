"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  SortAsc,
  SortDesc,
  BookOpen,
  Edit3,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Grid3X3,
  List,
  MoreVertical,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { useUser } from "@clerk/nextjs";

interface Story {
  id: string;
  title: string;
  status: "Draft" | "Published";
  lastEdited: string;
  createdAt: string;
  publishedAt?: string;
  wordCount: number;
  genre: string;
  description: string;
  likes: number;
  comments: number;
}

interface MyStoriesContentProps {
  stories: Story[];
  userName: string;
}

type ViewMode = "grid" | "list";
type SortBy = "lastEdited" | "createdAt" | "title" | "wordCount" | "publishedAt";
type SortOrder = "asc" | "desc";
type FilterStatus = "all" | "draft" | "published";

export default function MyStoriesContent({
  stories: initialStories,
  userName,
}: MyStoriesContentProps) {
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("lastEdited");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Dynamic stories per page based on view mode
  const storiesPerPage = viewMode === "list" ? 3 : 6;

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters or view mode change
  }, [searchQuery, filterStatus, filterGenre, viewMode]);

  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(stories.map((story) => story.genre))];
    return uniqueGenres.sort();
  }, [stories]);

  const filteredAndSortedStories = useMemo(() => {
    const filtered = stories.filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.genre.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || story.status.toLowerCase() === filterStatus;

      const matchesGenre = filterGenre === "all" || story.genre === filterGenre;

      return matchesSearch && matchesStatus && matchesGenre;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;


      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "wordCount":
          aValue = a.wordCount;
          bValue = b.wordCount;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "publishedAt":
          aValue = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
          bValue = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
          break;
        default:
          aValue = new Date(a.lastEdited);
          bValue = new Date(b.lastEdited);
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [stories, searchQuery, sortBy, sortOrder, filterStatus, filterGenre]);

  const totalStories = filteredAndSortedStories.length;
  const totalPages = Math.ceil(totalStories / storiesPerPage);
  const startIndex = (currentPage - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;
  const currentStories = filteredAndSortedStories.slice(startIndex, endIndex);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date("2025-07-01T13:06:00+05:30"); // Updated to current time
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const handleDeleteStory = (storyId: string, storyTitle: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a story.");
      return;
    }
    setStoryToDelete({ id: storyId, title: storyTitle });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!storyToDelete || !user) return;

    try {
      const response = await fetch(`/api/stories/${storyToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete story");
      }

      setStories((prevStories) =>
        prevStories.filter((story) => story.id !== storyToDelete.id)
      );
      toast.success("Story deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story. Please try again.");
    } finally {
      setDeleteDialogOpen(false);
      setStoryToDelete(null);
    }
  };

  const StoryCard = ({ story }: { story: Story }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 max-sm:pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg max-sm:text-base truncate group-hover:text-primary transition-colors">
              {story.title}
            </h3>
            <p className="text-sm max-sm:text-xs text-muted-foreground mt-1 line-clamp-2">
              {story.description || "No description available"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/story/${story.id}`}
                  className="cursor-pointer flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/edit-story/${story.id}`}
                  className="cursor-pointer flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteStory(story.id, story.title)}
                className="text-destructive cursor-pointer flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0 max-sm:pb-2">
        <div className="flex items-center gap-2 mb-3 max-sm:mb-2 max-sm:gap-1">
          <Badge
            variant={story.status === "Published" ? "default" : "secondary"}
            className={cn(
              "text-xs",
              story.status === "Published"
                ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                : "bg-green-500/10 text-green-500 border-green-500/20"
            )}
          >
            {story.status}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {story.genre}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 max-sm:gap-2 text-sm max-sm:text-xs text-muted-foreground mb-4 max-sm:mb-2">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{story.wordCount.toLocaleString()} words</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatRelativeTime(story.lastEdited)}</span>
          </div>
          {story.status === "Published" && (
            <>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{story.likes} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{story.comments} comments</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 max-sm:gap-1">
          <Button asChild size="sm" className="flex-1 cursor-pointer max-sm:text-xs">
            <Link href={`/edit-story/${story.id}`}>
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 cursor-pointer max-sm:text-xs"
          >
            <Link href={`/story/${story.id}`}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const StoryListItem = ({ story }: { story: Story }) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/30">
      <CardContent className="p-4 max-sm:p-3">
        <div className="flex max-sm:flex-col items-center max-sm:items-start justify-between max-sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 max-sm:gap-2 mb-2 max-sm:flex-wrap">
              <h3 className="font-semibold text-lg max-sm:text-base truncate group-hover:text-primary transition-colors">
                {story.title}
              </h3>
              <Badge
                variant={story.status === "Published" ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  story.status === "Published"
                    ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                    : "bg-green-500/10 text-green-500 border-green-500/20"
                )}
              >
                {story.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {story.genre}
              </Badge>
            </div>

            <p className="text-sm max-sm:text-xs text-muted-foreground mb-3 max-sm:mb-2 line-clamp-1">
              {story.description || "No description available"}
            </p>

            <div className="flex items-center gap-6 max-sm:gap-3 max-sm:flex-wrap text-sm max-sm:text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{story.wordCount.toLocaleString()} words</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated {formatRelativeTime(story.lastEdited)}</span>
              </div>
              {story.status === "Published" && (
                <>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{story.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{story.comments}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 max-sm:gap-1 ml-4 max-sm:ml-0 max-sm:w-full">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="cursor-pointer max-sm:flex-1 max-sm:text-xs"
            >
              <Link href={`/story/${story.id}`}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="cursor-pointer max-sm:flex-1 max-sm:text-xs"
            >
              <Link href={`/edit-story/${story.id}`}>
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleDeleteStory(story.id, story.title)}
                  className="text-destructive cursor-pointer flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-8 max-sm:px-4 py-8 w-full max-h-svh">
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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 max-sm:flex-col max-sm:gap-4">
          <div>
            <h1 className="text-3xl max-sm:text-2xl font-bold mb-2 text-primary">My Stories</h1>
            <p className="text-muted-foreground max-sm:text-sm">
              Manage and organize your creative works, {userName}
            </p>
          </div>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 cursor-pointer max-sm:w-full"
          >
            <Link href="/create-story">
              <Plus className="h-4 w-4 mr-2" />
              New Story
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card className="mb-6 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 max-sm:gap-3 max-sm:flex-col">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories by title, description, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-sm:text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 max-sm:gap-1">
              <Select
                value={filterStatus}
                onValueChange={(value: FilterStatus) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-[140px] max-sm:w-[120px] cursor-pointer max-sm:text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="all">
                    All Status
                  </SelectItem>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="published">
                    Published
                  </SelectItem>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="draft">
                    Draft
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger className="w-[140px] max-sm:w-[120px] cursor-pointer max-sm:text-xs">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="all">
                    All Genres
                  </SelectItem>
                  {genres.map((genre) => (
                    <SelectItem
                      className="cursor-pointer max-sm:text-xs"
                      key={genre}
                      value={genre}
                    >
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: SortBy) => setSortBy(value)}
              >
                <SelectTrigger className="w-[140px] max-sm:w-[120px] cursor-pointer max-sm:text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="lastEdited">
                    Last Edited
                  </SelectItem>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="createdAt">
                    Created Date
                  </SelectItem>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="publishedAt">
                    Published Date
                  </SelectItem>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="title">
                    Title
                  </SelectItem>
                  <SelectItem className="cursor-pointer max-sm:text-xs" value="wordCount">
                    Word Count
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="cursor-pointer max-sm:w-9 max-sm:h-9"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none cursor-pointer max-sm:w-9 max-sm:h-9"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none cursor-pointer max-sm:w-9 max-sm:h-9"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stories */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm max-sm:text-xs text-muted-foreground">
          Showing {Math.min(currentStories.length, storiesPerPage)} of{" "}
          {filteredAndSortedStories.length} stories
        </p>
      </div>

      {filteredAndSortedStories.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 max-sm:h-10 max-sm:w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg max-sm:text-base font-semibold mb-2">No stories found</h3>
            <p className="text-muted-foreground max-sm:text-xs mb-4">
              {stories.length === 0
                ? "You haven't created any stories yet. Start your writing journey!"
                : "Try adjusting your search or filter criteria."}
            </p>
            {stories.length === 0 && (
              <Button asChild className="cursor-pointer max-sm:text-xs">
                <Link href="/create-story">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Story
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-sm:gap-4 max-sm:grid-cols-1"
                : "space-y-4"
            )}
          >
            {currentStories.map((story) =>
              viewMode === "grid" ? (
                <StoryCard key={story.id} story={story} />
              ) : (
                <StoryListItem key={story.id} story={story} />
              )
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="py-8 flex justify-center">
              <Pagination>
                <PaginationContent className="max-sm:flex-wrap max-sm:gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer max-sm:text-xs"
                      }
                      size="default"
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className={
                            currentPage === page
                              ? "bg-primary text-primary-foreground max-sm:text-xs"
                              : "cursor-pointer max-sm:text-xs"
                          }
                          size="default"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer max-sm:text-xs"
                      }
                      size="default"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-sm:w-[90vw] bg-card text-foreground border-border rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl max-sm:text-lg font-semibold text-foreground">
              Delete Story
            </DialogTitle>
            <DialogDescription className="text-muted-foreground max-sm:text-sm">
              Are you sure you want to delete{" "}
              <strong>{storyToDelete?.title}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setStoryToDelete(null);
              }}
              className="w-full sm:w-auto bg-transparent text-foreground border-border hover:bg-muted cursor-pointer max-sm:text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-destructive text-white hover:bg-destructive/90 cursor-pointer max-sm:text-xs"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}