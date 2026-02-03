import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const issues = [
  {
    title: "Fix auth token refresh logic",
    repo: "vercel / next.js",
    status: "In Progress",
  },
  {
    title: "Improve docs for API errors",
    repo: "stripe / api",
    status: "Submitted",
  },
];

export default function ActiveIssues() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Active issues
      </h2>

      {issues.length === 0 ? (
        <div className="border border-[#30363d] rounded-xl p-6 text-center text-[#8b949e]">
          You don’t have any active issues right now.
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {issue.title}
                </p>
                <p className="text-sm text-[#6e7681]">
                  {issue.repo}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-xs rounded bg-[#161b22] border border-[#30363d]">
                  {issue.status}
                </span>

                <Button
                  variant="link"
                  className="p-0 h-auto text-[#2f81f7]"
                >
                  View <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
