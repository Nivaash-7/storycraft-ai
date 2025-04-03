import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarDemo } from "@/components/SidebarDemo";
import { DashboardContent } from "@/components/DashboardContent";

const mockStories = [
  { id: 1, title: "The Lost Kingdom", status: "Draft", lastEdited: "2025-03-30", progress: 60, wordCount: 4500, genre: "Fantasy" },
  { id: 2, title: "Echoes of the Past", status: "Published", lastEdited: "2025-03-29", progress: 100, wordCount: 12000, genre: "Historical Fiction" },
  { id: 3, title: "A New Dawn", status: "Draft", lastEdited: "2025-03-28", progress: 20, wordCount: 1500, genre: "Science Fiction" },
  { id: 4, title: "Whispers in the Dark", status: "Draft", lastEdited: "2025-03-27", progress: 85, wordCount: 9000, genre: "Mystery" },
];

const mockActivities = [
  { id: 1, action: "Published", storyTitle: "The Lost Kingdom", timestamp: "2025-03-30 14:30" },
  { id: 2, action: "Published", storyTitle: "Echoes of the Past", timestamp: "2025-03-29 09:15" },
  { id: 3, action: "Started", storyTitle: "A New Dawn", timestamp: "2025-03-28 18:45" },
  { id: 4, action: "Started", storyTitle: "Whispers in the Dark", timestamp: "2025-03-27 16:20" },
];

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarDemo
      dashboardContent={
        <DashboardContent
          firstName={user.firstName || "Storyteller"}
          stories={mockStories}
          activities={mockActivities}
        />
      }
    />
  );
}