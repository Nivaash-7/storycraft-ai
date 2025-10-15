import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Story, User } from "@/lib/models";
import { ObjectId, WithId } from "mongodb";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  
  const { id } = await context.params;
  const { userId, title, genre, content, description, status } = await req.json();

  if (!userId || !id) {
    return NextResponse.json({ error: "userId and id are required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("storycraft");

    const updateData: Partial<Story> = {
      title,
      genre,
      content,
      description,
      wordCount: content?.split(/\s+/).filter(Boolean).length || 0,
      updatedAt: new Date(),
      lastEdited: new Date(),
      ...(status && { status, publishedAt: status === "Published" ? new Date() : undefined }),
    };

    const result: WithId<Story> | null = await db
      .collection<Story>("stories")
      .findOneAndUpdate(
        { _id: new ObjectId(id), userId },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ ...result, _id: result._id.toString() });
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("storycraft");

    const story = await db.collection<Story>("stories").findOne({
      _id: new ObjectId(id),
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ ...story, _id: story._id.toString() });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await req.json();

  if (!id || !userId) {
    return NextResponse.json(
      { error: "id and userId are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("storycraft");

    const result = await db.collection<Story>("stories").deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Story not found or not authorized" },
        { status: 404 }
      );
    }

    // Use the User type for the collection to fix typing issues
    await db.collection<User>("users").updateOne(
      { userId },
      { $pull: { publishedStories: new ObjectId(id) } }
    );

    await db.collection("activities").deleteMany({
      storyId: new ObjectId(id),
      userId,
    });

    return NextResponse.json(
      { message: "Story deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
