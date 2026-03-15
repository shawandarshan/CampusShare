import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
        const { status } = body; // "Approved" | "Rejected" | "Pending" | "Returned"

        if (!["Approved", "Rejected", "Pending", "Returned"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const requestRef = doc(db, "requests", id);
        const requestSnap = await getDoc(requestRef);

        if (!requestSnap.exists()) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        const requestData = requestSnap.data();
        const userId = (session.user as any).id || session.user.email;

        // Only the item owner can update the status
        if (requestData.ownerId !== userId) {
            return NextResponse.json({ error: "Forbidden: You are not the owner of this item" }, { status: 403 });
        }

        await updateDoc(requestRef, { 
            status, 
            isRead: true,
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({
            message: `Request ${status} successfully`,
            request: { _id: id, ...requestData, status },
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
        const requestRef = doc(db, "requests", id);
        const requestSnap = await getDoc(requestRef);

        if (!requestSnap.exists()) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        const requestData = requestSnap.data();
        const userId = (session.user as any).id || session.user.email;

        // Only the requester can delete the request
        if (requestData.requesterId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await deleteDoc(requestRef);
        return NextResponse.json({ message: "Request deleted" }, { status: 200 });
    } catch (error: any) {
        console.error("DELETE request exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
