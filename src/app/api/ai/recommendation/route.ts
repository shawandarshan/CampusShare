import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { recommendation: "Please coordinate with the admin to add a GEMINI_API_KEY in the environment variables to get personalized recommendations." },
                { status: 200 }
            );
        }

        // 🚧 MONGODB REMOVED: Waiting for Supabase integration
        const availableItems: any[] = [];

        const itemsContext = availableItems.map(
            (item: any) => `- ${item.name} (Category: ${item.category})`
        ).join("\n");

        const systemPrompt = `
            You are the AI Recommendation Engine for CampusShare.
            The current user is a college student named ${(session.user as any).name}.
            
            Here are the items currently available on the platform:
            ${itemsContext || "No specific items are widely available right now."}
            
            Based on this context, write a short, single-paragraph personalized recommendation suggesting 2 or 3 items or categories they might find useful for their current semester projects or studies.
            Be encouraging and keep it brief (max 3 sentences).
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();

        return NextResponse.json({ recommendation: text });

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        return NextResponse.json({ recommendation: "Explore the newest items on campus to aid your semester projects!" });
    }
}
