import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "https://backend-v2-sb9v.vercel.app",
    fetchOptions: {
        credentials: "include"
    }
});
