"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscoverHeroProps {
  username: string | null;
  repoCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function DiscoverHero({ username, repoCount, onRefresh, isLoading }: DiscoverHeroProps) {
  return (
    <div className="bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {username ? `Welcome back, ${username}!` : "Discover Repositories"}
          </h1>
          <p className="mt-2 text-[#8b949e]">
            {repoCount > 0 
              ? `Found ${repoCount} repositories matching your interests`
              : "Loading personalized recommendations..."}
          </p>
        </div>

        <Button
          onClick={onRefresh}
          disabled={isLoading}
          variant="outline"
          className="border-[#30363d] hover:bg-[#161b22] shrink-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
}
