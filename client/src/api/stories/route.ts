// GET endpoint (not directly called in DashboardContent.tsx but used in page.tsx to fetch data and pass as props)
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Story } from "@/lib/models/Story";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("storycraft");

    const query: { userId: string; status?: "Draft" | "Published" } = { userId };
    if (status) {
      query.status = status as "Draft" | "Published";
    }

    const stories = await db
      .collection<Story>("stories")
      .find(query)
      .sort({ lastEdited: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(
      stories.map((s) => ({ ...s, _id: s._id.toString() }))
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}
