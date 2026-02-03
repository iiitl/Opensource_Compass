import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IssueCard() {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 hover:border-[#2f81f7] transition-colors">
      
      <div className="space-y-1">
        <h3 className="font-medium">
          Fix authentication token refresh logic
        </h3>

        <p className="text-sm text-[#6e7681]">
          vercel / next.js · TypeScript
        </p>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-[#8b949e]">
        <span className="px-2 py-0.5 rounded bg-[#161b22]">
          Difficulty: Easy
        </span>
        <span className="px-2 py-0.5 rounded bg-[#161b22]">
          Status: Saved
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button variant="link" className="p-0 h-auto text-[#2f81f7]">
          View Issue <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="border-[#30363d]"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

