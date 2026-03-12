import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: "firebase-google",
            name: "Firebase Google",
            credentials: {
                email: { type: "text" },
                name: { type: "text" },
                image: { type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email) {
                    throw new Error("Missing email from Google");
                }

                if (!credentials.email.endsWith("@mce.edu.in")) {
                    throw new Error("Only authorised users of the MCE Domain can process.");
                }

                // Return the Firebase user directly without saving to MongoDB.
                // You can sync this with Supabase/Firestore in the future.
                return {
                    id: credentials.email, // using email as ID temporarily
                    name: credentials.name || "Student",
                    email: credentials.email,
                    image: credentials.image || "",
                };
            },
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "student@college.edu" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                if (!credentials.email.endsWith("@mce.edu.in")) {
                    throw new Error("Only authorised users of the MCE Domain can process.");
                }

                // Temporary dummy auth block to bypass MongoDB requirement
                // You will replace this with Firebase Auth or Supabase Auth.
                return {
                    id: "temp-user-id",
                    name: "Demo Student",
                    email: credentials.email,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
    pages: {
        signIn: "/auth/signin",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
