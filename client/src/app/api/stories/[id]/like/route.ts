import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Story, Comment } from "@/lib/models";
import { ObjectId } from "mongodb";

const toStringSafe = (d: Date | string | undefined) =>
  d instanceof Date ? d.toString() : d || "";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { userId, action } = await req.json();

  if (!userId || !["like", "unlike"].includes(action) || !id) {
    return NextResponse.json(
      { error: "userId, valid action (like/unlike), and id are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const story = await db
      .collection<Story>("stories")
      .findOne({ _id: new ObjectId(id) });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (action === "like" && story.likes.includes(userId)) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }

    if (action === "unlike" && !story.likes.includes(userId)) {
      return NextResponse.json({ error: "Not liked yet" }, { status: 400 });
    }

    const updateOperation =
      action === "like"
        ? { $push: { likes: userId } }
        : { $pull: { likes: userId } };

    const updatedStory = await db
      .collection<Story>("stories")
      .findOneAndUpdate({ _id: new ObjectId(id) }, updateOperation, {
        returnDocument: "after",
      });

    if (!updatedStory) {
      return NextResponse.json(
        { error: "Failed to update like" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...updatedStory,
      _id: updatedStory._id.toString(),
      lastEdited: toStringSafe(updatedStory.lastEdited),
      createdAt: toStringSafe(updatedStory.createdAt),
      updatedAt: toStringSafe(updatedStory.updatedAt),
      publishedAt: toStringSafe(updatedStory.publishedAt),
      comments: updatedStory.comments.map((c: Comment) => ({
        ...c,
        _id: c._id.toString(),
        createdAt: toStringSafe(c.createdAt),
      })),
    });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
}
