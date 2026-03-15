import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id || session.user.email;
        const profileRef = doc(db, "profiles", userId);
        const profileSnap = await getDoc(profileRef);

        let profileData;
        if (profileSnap.exists()) {
            profileData = profileSnap.data();
        } else {
            // Default profile for new users
            profileData = {
                name: session.user.name || "Student",
                email: session.user.email,
                profileImage: session.user.image || "",
                college: "Meenakshi College of Engineering",
                department: "",
                year: "",
                contact: "",
            };
        }

        // Also fetch user's items from Firestore
        const itemsQuery = query(collection(db, "items"), where("ownerId", "==", userId));
        const itemsSnap = await getDocs(itemsQuery);
        const items = itemsSnap.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ user: profileData, items }, { status: 200 });
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

        const userId = (session.user as any).id || session.user.email;
        const body = await req.json();

        const profileRef = doc(db, "profiles", userId);
        const profileSnap = await getDoc(profileRef);

        const updatedProfile = {
            name: body.name || session.user.name || "Student",
            profileImage: body.profileImage || session.user.image || "",
            college: body.college || "Meenakshi College of Engineering",
            department: body.department || "",
            year: body.year || "",
            contact: body.contact || "",
            updatedAt: new Date().toISOString(),
        };

        if (profileSnap.exists()) {
            await updateDoc(profileRef, updatedProfile);
        } else {
            await setDoc(profileRef, {
                ...updatedProfile,
                email: session.user.email,
                createdAt: new Date().toISOString(),
            });
        }

        return NextResponse.json({ 
            success: true, 
            user: { ...updatedProfile, email: session.user.email } 
        }, { status: 200 });
    } catch (error) {
        console.error("PATCH profile exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
