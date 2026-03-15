import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const type = url.searchParams.get("type"); // "incoming" or "outgoing"
        const userId = (session.user as any).id || session.user.email;

        let requestsQuery;
        if (type === "outgoing") {
            requestsQuery = query(
                collection(db, "requests"),
                where("requesterId", "==", userId),
                orderBy("createdAt", "desc")
            );
        } else {
            // Default: incoming requests for items owned by current user
            requestsQuery = query(
                collection(db, "requests"),
                where("ownerId", "==", userId),
                orderBy("createdAt", "desc")
            );
        }

        const querySnapshot = await getDocs(requestsQuery);
        const requests = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ requests }, { status: 200 });
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
        const userId = (session.user as any).id || session.user.email;

        // ✅ Duplicate check: prevent same user requesting same item twice
        const existingQuery = query(
            collection(db, "requests"),
            where("itemId", "==", body.itemId || ""),
            where("requesterId", "==", userId),
            where("status", "==", "Pending")
        );
        const existingSnap = await getDocs(existingQuery);

        if (!existingSnap.empty) {
            return NextResponse.json(
                { error: "You already have a pending request for this item." },
                { status: 409 }
            );
        }

        const newRequest = {
            itemId: {
                id: body.itemId || "",
                name: body.itemName || "Item",
            },
            // Owner
            ownerId: body.ownerId || "",
            ownerEmail: body.ownerEmail || "",

            // Requester
            requesterId: {
                _id: userId,
                name: session.user.name || "Student",
                college: body.requesterCollege || "Meenakshi College of Engineering",
                department: body.requesterDept || "",
                year: body.requesterYear || "",
                phone: body.requesterPhone || "",
            },
            requesterIdRaw: userId, // For query indexing

            message: body.message || "",
            status: "Pending",
            isRead: false,
            createdAt: new Date().toISOString(),
        };

        // Standardize structure for queries
        const docData = {
            ...newRequest,
            requesterId: userId, // Override indexable ID
            requesterMetadata: newRequest.requesterId, // Keep details for UI
            itemMetadata: newRequest.itemId, // Keep details for UI
            itemId: newRequest.itemId.id // Indexable ID
        };

        const docRef = await addDoc(collection(db, "requests"), docData);

        return NextResponse.json({
            message: "Request created successfully",
            request: { _id: docRef.id, ...docData },
        }, { status: 201 });
    } catch (error: any) {
        console.error("POST requests exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
