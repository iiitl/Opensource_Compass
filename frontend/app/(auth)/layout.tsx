"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar"; // your Aceternity sidebar
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import LoadingSpinner from "@/components/loading-spinner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/?error=auth_required');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden rounded-md border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] md:flex-row",
        "h-screen"
      )}
    >
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-y-auto p-6">{children}</main>
    </div>
  );
}