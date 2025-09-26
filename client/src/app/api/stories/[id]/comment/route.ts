import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Story } from "@/lib/models/Story";
import { ObjectId, WithId } from "mongodb";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId, username, content } = await req.json();

  if (!userId || !content || !id) {
    return NextResponse.json({ error: "userId, content, and id are required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("storycraft");

    const story = await db.collection<Story>("stories").findOne({ _id: new ObjectId(id) });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const newComment = {
      _id: new ObjectId(),
      userId,
      username: username || "Anonymous",
      content,
      createdAt: new Date(),
    };

    const result = await db
      .collection("stories")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { comments: newComment } as any },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }

    return NextResponse.json({ ...result, _id: result._id.toString() });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}