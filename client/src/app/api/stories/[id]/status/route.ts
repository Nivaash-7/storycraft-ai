import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Story } from "@/lib/models/Story";

interface UpdateStatusRequest {
  userId: string;
  status: "Draft" | "Published";
  publishedAt?: string;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  let body: UpdateStatusRequest;
  try {
    body = await req.json() as UpdateStatusRequest;
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
  }

  const { userId, status, publishedAt } = body;

  if (!id || !userId || !["Draft", "Published"].includes(status)) {
    console.error("Invalid request parameters:", { id, userId, status });
    return NextResponse.json({ error: "Invalid request: Missing or invalid parameters" }, { status: 400 });
  }

  try {
    if (!ObjectId.isValid(id)) {
      console.error("Invalid story ID:", id);
      return NextResponse.json({ error: "Invalid story ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("storycraft");

    const update: any = { status };
    if (status === "Published" && !publishedAt) {
      update.publishedAt = new Date();
    } else if (status === "Draft") {
      update.$unset = { publishedAt: "" };
    }

    const result = await db.collection<Story>("stories").findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      update,
      { returnDocument: "after" }
    );

    if (!result) {
      console.error("Story not found or unauthorized:", { id, userId });
      return NextResponse.json({ error: "Story not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({
      ...result,
      id: result._id.toString(),
      title: result.title ?? "",
      description: result.description ?? "",
      genre: result.genre ?? "",
      content: result.content ?? "",
      status: result.status ?? "Draft",
      wordCount: result.wordCount ?? 0,
      lastEdited: result.lastEdited ? new Date(result.lastEdited).toISOString() : new Date().toISOString(),
      createdAt: result.createdAt ? new Date(result.createdAt).toISOString() : new Date().toISOString(),
      publishedAt: result.publishedAt ? new Date(result.publishedAt).toISOString() : undefined,
      likes: result.likes?.length ?? 0,
      comments: result.comments?.length ?? 0,
    });
  } catch (error: any) {
    console.error("Error updating story status:", {
      id,
      userId,
      status,
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: `Failed to update story status: ${error.message}` },
      { status: 500 }
    );
  }
}