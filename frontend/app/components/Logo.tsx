"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
    variant?: "default" | "white" | "large";
}

export default function Logo({ variant = "default" }: LogoProps) {
    const isLarge = variant === "large";

    return (
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            {/* Using standard img tag for immediate reliability checking, and removed explicit width/height wrapper constraints that might clip it */}
            <div className={`relative flex items-center justify-center ${isLarge ? "h-20" : "h-12"}`}>
                <img
                    src="/logo.png"
                    alt="MediStore Logo"
                    className="h-full w-auto object-contain"
                />
            </div>
        </Link>
    );
}
