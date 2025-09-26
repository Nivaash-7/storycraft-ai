import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Story } from "@/lib/models/Story"

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("storycraft")

    const stories = await db
      .collection<Story>("stories")
      .aggregate([
        {
          $match: { status: "Published" },
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
                $ifNull: [{ $arrayElemAt: ["$authorInfo.username", 0] }, "Anonymous"],
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
        {
          $sort: { publishedAt: -1 },
        },
        {
          $limit: 100,
        },
      ])
      .toArray()

    return NextResponse.json(
      stories.map((story) => ({
        ...story,
        _id: story._id.toString(),
        likes: story.likes?.map((id: any) => id.toString()) || [],
        comments:
          story.comments?.map((comment: any) => ({
            ...comment,
            _id: comment._id?.toString() || `c${Date.now()}${Math.random()}`,
          })) || [],
      })),
    )
  } catch (error) {
    console.error("Error fetching published stories:", error)
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
  }
}
