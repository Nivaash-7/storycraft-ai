import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Story } from "@/lib/models/Story";
import { ObjectId, WithId } from "mongodb";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId, action } = await req.json();

  if (!userId || !["like", "unlike"].includes(action) || !id) {
    return NextResponse.json({ error: "userId, valid action (like/unlike), and id are required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("storycraft");

    const story = await db.collection<Story>("stories").findOne({ _id: new ObjectId(id) });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    let updatedStory: WithId<Story> | null = null;
    if (action === "like") {
      if (story.likes.includes(userId)) {
        return NextResponse.json({ error: "Already liked" }, { status: 400 });
      }
      updatedStory = await db.collection<Story>("stories").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { likes: userId } },
        { returnDocument: "after" }
      );
    } else if (action === "unlike") {
      if (!story.likes.includes(userId)) {
        return NextResponse.json({ error: "Not liked yet" }, { status: 400 });
      }
      updatedStory = await db.collection<Story>("stories").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $pull: { likes: userId } },
        { returnDocument: "after" }
      );
    }

    if (!updatedStory) {
      return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
    }

    return NextResponse.json({ ...updatedStory, _id: updatedStory._id.toString() });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }
}