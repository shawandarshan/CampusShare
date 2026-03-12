import { NextResponse } from "next/server";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Next.js 15: params is now a Promise
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log("Fetching item with Firestore ID:", id);

        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        console.log("Firestore docSnap.exists():", docSnap.exists());

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        const data = {
            _id: docSnap.id,
            id: docSnap.id,
            ...docSnap.data(),
        };

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("GET item error:", error?.code, error?.message);

        if (error?.code === "permission-denied") {
            return NextResponse.json({
                error: "Firestore permission denied. Please update your Firestore Security Rules to allow reads.",
                code: "permission-denied"
            }, { status: 403 });
        }

        return NextResponse.json({ error: "Failed to fetch item", details: error?.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const docRef = doc(db, "items", id);
        await deleteDoc(docRef);
        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("DELETE item error:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const docRef = doc(db, "items", id);
        await updateDoc(docRef, body);
        return NextResponse.json({ message: "Item updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("PATCH item error:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}
