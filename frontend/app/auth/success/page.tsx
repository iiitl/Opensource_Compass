"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

function AuthSuccessContent() {
  const router = useRouter();
  // useSearchParams triggers de-opt if not wrapped in Suspense
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    console.log("🔐 Auth Success Page Loaded");
    
    const verifyAuth = async () => {
      // Get token from URL query parameter
      const token = searchParams.get('token');
      console.log("🔑 Token from URL:", token ? `Found (${token.substring(0, 20)}...)` : "Not found");
      
      if (token) {
        // Save token to localStorage
        localStorage.setItem('auth_token', token);
        console.log("💾 Token saved to localStorage");
        
        // Also save to cookies so middleware can access it
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        console.log("🍪 Token saved to cookies");
        
        // Verify the session by calling checkAuth
        console.log("🔄 Verifying session...");
        try {
          await checkAuth();
          console.log("✅ Auth verified, redirecting to onboarding");
          router.push("/onboarding");
        } catch (error) {
          console.error("❌ Auth verification failed:", error);
          router.push("/?error=auth_failed");
        }
      } else {
        console.error("❌ No token in URL");
        router.push("/?error=no_token");
      }
    };

    verifyAuth();
  }, [router, checkAuth, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0d1117] text-white">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Authenticating...</h1>
        <p className="text-[#8b949e]">Please wait while we log you in.</p>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#30363d] border-t-[#2f81f7]"></div>
        </div>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0d1117] text-white">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#30363d] border-t-[#2f81f7]"></div>
          </div>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
