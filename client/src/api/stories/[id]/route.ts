import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId} from "mongodb";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = await req.json();

  if (!id || !userId) {
    return NextResponse.json({ error: "id and userId are required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("storycraft");

    const result = await db.collection("stories").deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Story not found or not authorized" }, { status: 404 });
    }

    await db.collection("users").updateOne(
      { userId },
      { $pull: { publishedStories: new ObjectId(id) as any } } 
    );

    await db.collection("activities").deleteMany({
      storyId: new ObjectId(id),
      userId,
    });

    return NextResponse.json({ message: "Story deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
