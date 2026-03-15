import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email;

        const { data, error } = await supabaseAdmin
            .from("profiles")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (error) {
            console.error("Supabase GET profile error:", error);
            return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
        }

        // Return existing or default profile
        const profile = data || {
            name: session.user.name || "Student",
            email,
            profile_image: session.user.image || "",
            college: "Malnad College of Engineering",
            department: "",
            year: "",
            contact: "",
        };

        return NextResponse.json({ user: profile, items: [] }, { status: 200 });
    } catch (error) {
        console.error("GET profile exception:", error);
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

        const profileData = {
            email,
            name: body.name || session.user.name || "Student",
            profile_image: body.profileImage || session.user.image || "",
            college: body.college || "",
            department: body.department || "",
            year: body.year || "",
            contact: body.contact || "",
            updated_at: new Date().toISOString(),
        };

        // Upsert: insert if not exists, update if exists
        const { data, error } = await supabaseAdmin
            .from("profiles")
            .upsert(profileData, { onConflict: "email" })
            .select()
            .single();

        if (error) {
            console.error("Supabase PATCH profile error:", error);
            return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: data }, { status: 200 });
    } catch (error) {
        console.error("PATCH profile exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
