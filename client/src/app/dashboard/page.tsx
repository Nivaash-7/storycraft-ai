import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ModernSidebar } from "@/components/ModernSidebar";
import DashboardContent from "@/components/DashboardContent";
import clientPromise from "@/lib/mongodb";
import type { Story, Activity } from "@/lib/models";

export default async function Dashboard() {
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

const formattedActivities = activities.map((activity) => {
  const activityDate = new Date(activity.createdAt);
  const istOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const istTime = activityDate.toLocaleString('en-US', istOptions);

  return {
    id: activity._id.toString(),
    action: activity.type,
    storyTitle: activity.details.replace(/^Drafted\s+/, "") || "Unknown",
    timestamp: istTime,
  };
});

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
