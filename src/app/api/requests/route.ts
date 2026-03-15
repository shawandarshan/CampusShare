import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const type = url.searchParams.get("type"); // "incoming" or "outgoing"
        const userEmail = session.user.email!;

        let query = supabaseAdmin.from("requests").select("*");

        if (type === "outgoing") {
            query = query.eq("requester_email", userEmail);
        } else {
            // Default: incoming requests for items owned by current user
            query = query.eq("owner_email", userEmail);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase GET requests error:", error);
            return NextResponse.json({ error: "Failed to fetch requests", details: error.message }, { status: 500 });
        }

        return NextResponse.json({ requests: data || [] }, { status: 200 });
    } catch (error: any) {
        console.error("GET requests exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // ✅ Duplicate check: prevent same user requesting same item twice
        const { data: existing } = await supabaseAdmin
            .from("requests")
            .select("id")
            .eq("item_id", body.itemId || "")
            .eq("requester_email", session.user.email!)
            .eq("status", "pending")
            .maybeSingle();

        if (existing) {
            return NextResponse.json(
                { error: "You already have a pending request for this item." },
                { status: 409 }
            );
        }

        const newRequest = {
            item_id: body.itemId || "",
            item_name: body.itemName || "",

            // Owner
            owner_id: body.ownerId || "",
            owner_email: body.ownerEmail || "",

            // Requester (from session + body profile info)
            requester_email: session.user.email || "",
            requester_name: session.user.name || "",
            requester_image: session.user.image || "",
            requester_college: body.requesterCollege || "Malnad College of Engineering",
            requester_dept: body.requesterDept || "",
            requester_year: body.requesterYear || "",
            requester_phone: body.requesterPhone || "",

            message: body.message || "",
            status: "pending",
            is_read: false,
        };

        const { data, error } = await supabaseAdmin
            .from("requests")
            .insert([newRequest])
            .select()
            .single();

        if (error) {
            console.error("Supabase POST requests error:", error);
            return NextResponse.json({ error: "Failed to create request", details: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Request created successfully",
            request: data,
        }, { status: 201 });
    } catch (error: any) {
        console.error("POST requests exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
