import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export async function POST(req: NextRequest) {
  const { mode, input, storyContent, title, genre } = await req.json();

  try {
    let prompt = "";

    switch (mode) {
      case "chat":
        const chatHistory = storyContent ? `Previous Chat Context: The story so far is "${storyContent}..."\n` : "";
        prompt = `You are TaleWeaver, a friendly and creative AI writing assistant for a website where users write stories with AI help. Your personality is helpful, encouraging, and slightly playful. Respond in a conversational tone (50-100 words). ${
          title ? `Story title: "${title}". ` : ""
        }${genre ? `Genre: "${genre}". ` : ""}User: "${input}". ${chatHistory} Output the response as plain text without any markdown, bolding, bullets, or special formatting.`;
        break;

      case "generate":
        const generateHistory = storyContent ? `Previous Chat Context: The story so far is "${storyContent}..."\n` : "";
        prompt = `You are TaleWeaver, a creative and helpful AI modern story writing assistant. ${
          title ? `Story title: "${title}". ` : ""
        }${genre ? `Genre: "${genre}". ` : ""}Based on the user input "${input}" and the existing story "${storyContent}", continue the narrative with a standalone story snippet (50-150 words) that builds naturally on the prior events and themes. Prioritize smooth transitions for new characters or developments, avoiding abrupt introductions. Minimize repetition of recent actions or phrases unless they evolve uniquely. Use a modern writing style unless specified otherwise (e.g., gothic, poetic). Focus on advancing the plot with fresh perspectives, ensuring emotional or situational progression. If no specific direction is given, suggest a logical next step. Output ONLY the story snippet itself—do not include any introductions, explanations, wrappers, quotes, or additional text.${generateHistory}`;
        break;

      case "feedback":
        if (!storyContent?.trim()) {
          return NextResponse.json({ error: "No story content provided for feedback" }, { status: 400 });
        }
        const feedbackHistory = storyContent ? `Previous Feedback Context: The story so far is "${storyContent}..."\n` : "";
        prompt = `You are TaleWeaver, a supportive and insightful AI writing assistant for a website where users write stories with AI help. Story: "${storyContent}". ${
          title ? `Story title: "${title}". ` : ""
        }${genre ? `Genre: "${genre}". ` : ""}${feedbackHistory}User: "${input}". Give constructive feedback on pacing or dialogue, suggest one easy tweak, and ask a thoughtful question (50-100 words). Be encouraging but honest. Output the feedback as plain text paragraphs without any markdown, bolding, bullets, or special formatting. Structure it naturally: start with overall feedback, then the suggestion for tweak, then the question.`;
        break;

      case "summary":
        prompt = `Generate a concise summary (50-75 words) for this ${genre || "Unknown"} story: "${storyContent}...". Preserve the tone and key elements. Output only the plain summary text without any additional formatting, introductions, or explanations.`;
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