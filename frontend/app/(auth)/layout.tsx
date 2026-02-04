"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/sidebar"; // your Aceternity sidebar
import { cn } from "@/lib/utils";

export default function AuthLayout({ children }: { children: ReactNode }) {
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