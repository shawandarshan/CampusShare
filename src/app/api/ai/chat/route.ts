import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const userMessage = messages[messages.length - 1].content;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { reply: "Please coordinate with the admin to add a GEMINI_API_KEY in the environment variables." },
                { status: 200 }
            );
        }

        // 🚧 MONGODB REMOVED: Waiting for Supabase integration
        const availableItems: any[] = [];

        const itemsContext = availableItems.map(
            (item: any) => `- ${item.name} (${item.category}, ${item.condition} condition) available to ${item.mode} for ${item.availability}. Description: ${item.description}`
        ).join("\n");

        const systemPrompt = `
            You are the official CampusShare AI Assistant. Your job is to help college students find resources they want to borrow, exchange, or receive as donations on the platform.
            Always be extremely helpful, friendly, and concise.

            Here is a list of some currently available items on the platform:
            ${itemsContext || "No items are currently listed."}

            If a user asks for something that is in the list, tell them it is available and encourage them to go to the Browse page to find it.
            If a user asks for something not in the list, politely tell them it's not currently available, but they can check back later or add a request.
            
            User's latest message: ${userMessage}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();

        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ reply: "I'm having trouble connecting to my brain right now. Please try again later." });
    }
}
