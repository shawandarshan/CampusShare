import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status } = body; // "approved" | "rejected" | "pending"

        if (!["approved", "rejected", "pending"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("requests")
            .update({ status, is_read: true })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Supabase PATCH request error:", error);
            return NextResponse.json({ error: "Failed to update request", details: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: `Request ${status} successfully`,
            request: data,
        }, { status: 200 });
    } catch (error: any) {
        console.error("PATCH request exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const { error } = await supabase
            .from("requests")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json({ error: "Failed to delete request" }, { status: 500 });
        }

        return NextResponse.json({ message: "Request deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
