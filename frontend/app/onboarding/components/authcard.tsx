import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthCard() {
  return (
    <div className="bg-[#161b22]/40 backdrop-blur-sm border border-[#30363d] rounded-xl p-8 space-y-6 text-center hover:border-gray-600 transition-colors">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-white/5 rounded-full ring-1 ring-white/10">
            <Github className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Connect your GitHub
        </h1>
      </div>

      <p className="text-sm text-[#8b949e]">
        We use GitHub data to recommend repositories and beginner-friendly
        issues that match your interests.
      </p>

      <Button
        size="lg"
        className="bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] w-full text-base py-6 shadow-lg shadow-green-900/20"
        onClick={() => {
          window.location.href = "/api/auth/github";
        }}
      >
        <Github className="mr-2 h-5 w-5" />
        Continue with GitHub
      </Button>

      <p className="text-xs text-[#6e7681]">
        Read-only access • No private repositories
      </p>
    </div>
  );
}
