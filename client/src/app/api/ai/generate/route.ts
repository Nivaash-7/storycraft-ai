import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  const { mode, input, storyContent, title, genre } = await req.json();

  try {
    let prompt = "";

    switch (mode) {

      case "summary":
        prompt = `Generate a concise summary (50-75 words) for this ${genre || "Unknown"} story: "${storyContent}...". Preserve the tone and key elements.`;
        break;

      default:
        return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();
    if (!text) throw new Error("Response blocked by safety filters");

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error(`Error in ${mode} mode:`, error);
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 });
  }
}