import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-v2-sb9v.vercel.app",
    fetchOptions: {
        credentials: "include"
    }
})
