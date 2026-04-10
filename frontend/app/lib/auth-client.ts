import { createAuthClient } from "better-auth/react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const authClient = createAuthClient({
    baseURL: backendUrl,
    fetchOptions: {
        credentials: "include",
    }
});

export const { signIn, signUp, signOut, useSession } = authClient;
