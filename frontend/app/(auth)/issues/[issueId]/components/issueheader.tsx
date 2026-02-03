import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function IssueHeader() {
  return (
    <div className="space-y-3">
      <Link
        href="/issues"
        className="inline-flex items-center text-sm text-[#2f81f7]"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Issues
      </Link>

      <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
        Fix authentication token refresh logic
      </h1>

      <p className="text-[#8b949e] text-sm">
        vercel / next.js
      </p>
    </div>
  );
}
