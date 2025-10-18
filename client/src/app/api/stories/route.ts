import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Story, Activity } from "@/lib/models";

// POST: Create a new story
export async function POST(req: NextRequest) {
  const {
    userId,
    title,
    genre,
    content,
    description,
    status = "Draft",
  } = await req.json();

  // Validate required fields
  if (!userId || !title || !content || !genre) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Create index on userId for efficient queries
    await db.collection("stories").createIndex({ userId: 1 });

    // Prepare story data
    const story: Omit<Story, "_id"> = {
      userId,
      title,
      genre,
      content,
      description: description || "",
      status: status as "Draft" | "Published",
      wordCount: content.split(/\s+/).filter(Boolean).length,
      lastEdited: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: status === "Published" ? new Date() : undefined,
      likes: [],
      comments: [],
    };

    // Insert story into the database
    const storyResult = await db.collection("stories").insertOne(story);

    // Update user document if story is published
    if (status === "Published") {
      await db
        .collection("users")
        .updateOne(
          { userId },
          { $addToSet: { publishedStories: storyResult.insertedId } }
        );
    }

    // Create activity log
    const activity: Omit<Activity, "_id"> = {
      userId,
      storyId: storyResult.insertedId,
      type: status === "Published" ? "Published" : "Drafted",
      details:
        status === "Published" ? `Published ${title}` : `Drafted ${title}`,
      createdAt: new Date(),
    };
    await db.collection("activities").insertOne(activity);

    // Return the created story with _id as string
    return NextResponse.json(
      { ...story, _id: storyResult.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}

// GET: Fetch stories for a specific user with optional status filter
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  // Validate required userId
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Build query object
    const query: { userId: string; status?: "Draft" | "Published" } = {
      userId,
    };
    if (status) {
      query.status = status as "Draft" | "Published";
    }

    // Fetch stories with sorting and limit
    const stories = await db
      .collection<Story>("stories")
      .find(query)
      .sort({ lastEdited: -1 })
      .limit(50)
      .toArray();

    // Format response with string IDs and ISO date strings
    return NextResponse.json(
      stories.map((s) => ({
        ...s,
        _id: s._id.toString(),
        lastEdited: new Date(s.lastEdited).toISOString(),
        createdAt: new Date(s.createdAt).toISOString(),
        updatedAt: new Date(s.updatedAt).toISOString(),
        publishedAt: s.publishedAt
          ? new Date(s.publishedAt).toISOString()
          : undefined,
        comments: s.comments.map((c) => ({
          ...c,
          _id: c._id.toString(),
          createdAt: new Date(c.createdAt).toISOString(),
        })),
      }))
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
