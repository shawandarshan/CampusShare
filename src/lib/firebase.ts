import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC9jecUR-3rzKHqtRRMszxAEdNsx7rvlVI",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "campusshare-da775.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "campusshare-da775",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "campusshare-da775.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "307906401559",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:307906401559:web:b663d9f886c4abe801d352"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
