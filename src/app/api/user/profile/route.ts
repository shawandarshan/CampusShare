import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mock database so it retains changes during the session
let mockProfiles: Record<string, any> = {};

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email;

        // Create default empty profile if it doesn't exist
        if (!mockProfiles[email]) {
            mockProfiles[email] = {
                name: session.user.name || "Student",
                email: session.user.email,
                profileImage: session.user.image,
                college: "",
                department: "",
                year: "",
                contact: "",
                rating: 5,
                totalRatings: 1
            };
        }

        return NextResponse.json({ user: mockProfiles[email], items: [] }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email;
        const body = await req.json();

        if (mockProfiles[email]) {
            mockProfiles[email] = { ...mockProfiles[email], ...body };
        } else {
            mockProfiles[email] = { email, ...body };
        }

        return NextResponse.json({ success: true, user: mockProfiles[email] });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
