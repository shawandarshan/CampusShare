import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Treat Firebase as a server-side CJS package.
  // Prevents Turbopack from trying to bundle firebase's ESM barrel files,
  // which have an unresolvable @firebase/firestore re-export chain.
  serverExternalPackages: [
    "firebase",
    "firebase-admin",
    "@firebase/app",
    "@firebase/auth",
    "@firebase/firestore",
    "@firebase/firestore-compat",
    "@firebase/util",
    "@firebase/component",
    "@firebase/logger",
  ],
};

export default nextConfig;
