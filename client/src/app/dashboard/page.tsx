import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ModernSidebar } from "@/components/ModernSidebar";
import DashboardContent from "@/components/DashboardContent";
import clientPromise from "@/lib/mongodb";
import type { Story } from "@/lib/models/Story";
import type { Activity } from "@/lib/models/Activity";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in"); 
    return null;
  }

  const client = await clientPromise;
  const db = client.db("storycraft");

  const stories = await db
    .collection<Story>("stories")
    .find({ userId: user.id })
    .project({ content: 0 })
    .sort({ lastEdited: -1 })
    .toArray();

  const activities = await db
    .collection<Activity>("activities")
    .find({ userId: user.id })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  const formattedStories = stories.map((story) => ({
    id: story._id.toString(),
    title: story.title,
    status: story.status,
    lastEdited: story.lastEdited.toISOString().split("T")[0],
    wordCount: story.wordCount,
    genre: story.genre,
  }));

  const formattedActivities = activities.map((activity) => ({
    id: activity._id.toString(),
    action: activity.type,
    storyTitle: activity.details.split(" ")[1] || "Unknown",
    timestamp: activity.createdAt.toISOString().replace("T", " ").split(".")[0],
  }));

  return (
    <ModernSidebar>
      <div className="ml-4"> 
        <DashboardContent
          firstName={user.firstName || "Storyteller"}
          stories={formattedStories}
          activities={formattedActivities}
        />
      </div>
    </ModernSidebar>
  );
}