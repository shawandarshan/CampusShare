import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "campusshare-da775",
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace \n in the private key if needed
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

const adminDb = admin.firestore();

export { adminDb };
export default admin;
