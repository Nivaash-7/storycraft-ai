import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Story } from "@/lib/models";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId, username, content, avatar } = await req.json();

  if (!userId || !content || !id) {
    return NextResponse.json(
      { error: "userId, content, and id are required" },
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

    const newComment = {
      _id: new ObjectId(),
      userId,
      username,
      content,
      avatar,
      createdAt: new Date(),
    };

    const result = await db
      .collection<Story>("stories")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { comments: newComment } },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json(
        { error: "Failed to add comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ...result, _id: result._id.toString() });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
