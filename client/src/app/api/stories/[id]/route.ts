import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Story, User, Comment } from "@/lib/models";
import { ObjectId, WithId } from "mongodb";


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { userId, title, genre, content, description, status } = await req.json();

  if (!userId || !id) {
    return NextResponse.json(
      { error: "userId and id are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const updateData: Partial<Story> = {
      title,
      genre,
      content,
      description,
      wordCount: content?.split(/\s+/).filter(Boolean).length || 0,
      updatedAt: new Date(),
      lastEdited: new Date(),
      ...(status && {
        status,
        publishedAt: status === "Published" ? new Date() : undefined,
      }),
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

    // ATTACH AUTHOR INFO FOR UI Consistency
    const user = await db.collection<User>("users").findOne({ userId });
    const author = user
      ? { username: user.username || "Anonymous", avatar: user.avatar }
      : { username: "Anonymous" };

    return NextResponse.json({ ...result, _id: result._id.toString(), author });
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}

// GET SINGLE STORY (with AUTHOR info)
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
    const db = client.db();

    // Use aggregation to attach author info
    const storyArr = await db.collection<Story>("stories").aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "authorInfo",
        },
      },
      {
        $addFields: {
          author: {
            username: {
              $ifNull: [
                { $arrayElemAt: ["$authorInfo.username", 0] },
                "Anonymous",
              ],
            },
            avatar: { $arrayElemAt: ["$authorInfo.avatar", 0] },
          },
        },
      },
      {
        $project: {
          authorInfo: 0,
        },
      },
    ]).toArray();

    const story = storyArr[0];

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Normalize IDs for front-end
    return NextResponse.json({
      ...story,
      _id: story._id.toString(),
      likes: story.likes?.map((id: ObjectId) => id.toString()) || [],
      comments:
        story.comments?.map((comment: Comment) => ({
          ...comment,
          _id: typeof comment._id === "object" ? (comment._id as ObjectId).toString() : comment._id,
        })) || [],
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

// DELETE STORY
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
    const db = client.db();

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

    await db
      .collection<User>("users")
      .updateOne({ userId }, { $pull: { publishedStories: new ObjectId(id) } });

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
