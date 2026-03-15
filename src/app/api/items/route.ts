import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const querySearch = searchParams.get("q");

        let firestoreQuery = query(collection(db, "items"));

        if (category && category !== "All") {
            firestoreQuery = query(collection(db, "items"), where("category", "==", category));
        }

        const querySnapshot = await getDocs(firestoreQuery);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let items: any[] = querySnapshot.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data(),
        }));

        // Client-side text filter (Firestore doesn't support LIKE search)
        if (querySearch) {
            const lower = querySearch.toLowerCase();
            items = items.filter((item) =>
                item.name?.toLowerCase().includes(lower)
            );
        }

        return NextResponse.json({ items }, { status: 200 });
    } catch (error) {
        console.error("GET items error:", error);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const newItem = {
            name: body.name || "",
            category: body.category || "",
            condition: body.condition || "",
            description: body.description || "",
            availability: body.availability || "",
            mode: body.mode || "",
            images: body.images || [],
            imageUrl: body.images?.[0] || "",
            ownerId: body.ownerId || null,
            available: true,
            createdAt: new Date().toISOString(),
        };

        console.log("Adding item to Firestore:", newItem);
        const docRef = await addDoc(collection(db, "items"), newItem);
        console.log("Item added with ID:", docRef.id);

        return NextResponse.json({
            message: "Item created successfully",
            item: { _id: docRef.id, ...newItem }
        }, { status: 201 });
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        console.error("POST items error:", err);

        // Friendly error for Firestore permission issues
        if (err.code === "permission-denied") {
            return NextResponse.json({
                error: "Firestore permission denied. Please update your Firestore Security Rules to allow writes.",
                code: "permission-denied"
            }, { status: 403 });
        }

        return NextResponse.json({ error: "Failed to create item", details: err.message }, { status: 500 });
    }
}
