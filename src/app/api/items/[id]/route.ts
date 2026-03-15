import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

        const data = docSnap.data();
        const ownerId = data?.ownerId;
        
        // Fetch owner details from profiles collection
        let ownerData = { name: "Anonymous", college: "Campus Member", image: "" };
        if (ownerId) {
            const profileRef = doc(db, "profiles", ownerId);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
                const pData = profileSnap.data();
                ownerData = {
                    ...pData,
                    name: pData.name || "Student",
                    college: pData.college || "Meenakshi College of Engineering",
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            } else {
                // Fallback if profile doesn't exist yet
                ownerData = {
                    name: "MCE Student",
                    college: "Meenakshi College of Engineering",
                    image: ""
                };
            }
        }

        const responseData = {
            _id: docSnap.id,
            id: docSnap.id,
            ...data,
            ownerId: {
                _id: ownerId,
                ...ownerData
            }
        };

        return NextResponse.json(responseData, { status: 200 });
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
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Verify the requester owns the item
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        const itemData = docSnap.data();
        const userId = (session.user as any).id || session.user.email;

        if (itemData?.ownerId && itemData.ownerId !== userId) {
            return NextResponse.json({ error: "Forbidden: you do not own this item" }, { status: 403 });
        }

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
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Verify the requester owns the item
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        const itemData = docSnap.data();
        const userId = (session.user as any).id || session.user.email;

        if (itemData?.ownerId && itemData.ownerId !== userId) {
            return NextResponse.json({ error: "Forbidden: you do not own this item" }, { status: 403 });
        }

        const body = await req.json();
        await updateDoc(docRef, body);
        return NextResponse.json({ message: "Item updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("PATCH item error:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}
