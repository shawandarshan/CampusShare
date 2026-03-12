import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password, college } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!email.endsWith("@mce.edu.in")) {
            return NextResponse.json({ error: "Only authorised users of the MCE Domain can process." }, { status: 403 });
        }

        // Temporary stub to bypass MongoDB requirement.
        // You will replace this with Firebase Auth admin or Supabase user creation.

        return NextResponse.json({ message: "User registered successfully (Mock)" }, { status: 201 });
    } catch (error) {
        console.error("Registration config error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
