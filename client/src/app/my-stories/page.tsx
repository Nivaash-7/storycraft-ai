import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ModernSidebar } from "@/components/ModernSidebar";
import MyStoriesContent from "@/components/MyStoriesContent";
import clientPromise from "@/lib/mongodb";
import type { Story } from "@/lib/models";

export default async function MyStoriesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
    return null;
  }

  const client = await clientPromise;
  const db = client.db();

  const stories = await db
    .collection<Story>("stories")
    .find({ userId: user.id })
    .sort({ lastEdited: -1 })
    .toArray();

  const formattedStories = stories.map((story) => ({
    id: story._id.toString(),
    title: story.title,
    status: story.status,
    lastEdited: story.lastEdited.toString(),
    createdAt: story.createdAt.toString(),
    publishedAt: story.publishedAt?.toString(),
    wordCount: story.wordCount,
    genre: story.genre,
    description: story.description,
    likes: story.likes.length,
    comments: story.comments.length,
  }));

  return (
    <ModernSidebar>
      <div className="h-screen bg-background mx-auto max-w-8xl">
        <MyStoriesContent
          stories={formattedStories}
          userName={user.firstName || "Storyteller"}
        />
      </div>
    </ModernSidebar>
  );
}
