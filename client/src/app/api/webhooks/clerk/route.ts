import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import clientPromise from "@/lib/mongodb";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
const wh = new Webhook(CLERK_WEBHOOK_SECRET);

interface ClerkUserData {
  id: string;
  username?: string;
  first_name?: string;
  profile_image_url?: string;
  created_at: number;
  email_addresses?: Array<{ email_address: string }>;
}

interface ClerkEvent {
  type: string;
  data: ClerkUserData;
}

export async function POST(req: NextRequest) {
  const payload = await req.text();

  const headers = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
  };

  let event: ClerkEvent;
  try {
    event = wh.verify(payload, headers) as ClerkEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const data = event.data;

    try {
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection("users");

      const email = data.email_addresses && data.email_addresses.length > 0
        ? data.email_addresses[0].email_address
        : null;

      const userDoc = {
        userId: data.id,
        username: data.username || data.first_name || data.id,
        email: email,
        avatar: data.profile_image_url || null,
        createdAt: new Date(data.created_at),
        publishedStories: [],
      };

      const result = await usersCollection.insertOne(userDoc);
      console.log("User inserted with ID:", result.insertedId);

      return NextResponse.json({ message: "User saved", _id: result.insertedId });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("MongoDB insert error:", error);
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Event ignored" });
}
