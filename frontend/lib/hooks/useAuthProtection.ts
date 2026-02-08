"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function useAuthProtection() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        // Public paths that don't require authentication
        const publicPaths = ['/', '/onboarding', '/auth/login', '/auth/success'];

        // Check if current path is public
        const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path));

        if (isPublicPath) {
            return;
        }

        // Check auth state
        if (!isLoading && !isAuthenticated) {
            router.push('/?error=auth_required');
        }
    }, [pathname, router, isAuthenticated, isLoading]);
}
