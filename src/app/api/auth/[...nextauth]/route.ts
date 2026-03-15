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
                    throw new Error("Only @mce.edu.in accounts are allowed.");
                }

                return {
                    id: credentials.email,
                    name: credentials.name || "Student",
                    email: credentials.email,
                    image: credentials.image || "",
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
