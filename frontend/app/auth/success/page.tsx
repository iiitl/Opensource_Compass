"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import PageWrapper from "@/components/ui/page-wrapper";

function AuthSuccessContent() {
  const router = useRouter();
  // useSearchParams triggers de-opt if not wrapped in Suspense
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    console.log("🔐 Auth Success Page Loaded");
    
    const verifyAuth = async () => {
      // The backend sets a cookie before redirecting here.
      // We just need to verify the session.
      console.log("🔄 Verifying session...");
      try {
        await checkAuth();
        console.log("🔀 Redirecting to onboarding");
        router.replace("/onboarding");
      } catch (error) {
        console.error("❌ Auth verification failed:", error);
        router.push("/?error=auth_failed");
      }
    };

    verifyAuth();
  }, [router, checkAuth]);

  return (
    <PageWrapper className="flex h-screen items-center justify-center text-white">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Authenticating...</h1>
        <p className="text-[#8b949e]">Please wait while we log you in.</p>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#30363d] border-t-[#2f81f7]"></div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <PageWrapper className="flex h-screen items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#30363d] border-t-[#2f81f7]"></div>
          </div>
        </div>
      </PageWrapper>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
