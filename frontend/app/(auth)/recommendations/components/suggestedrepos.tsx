"use client";

import { Star, GitFork, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuggestedReposProps {
  repos: string[];
  topRepoId: string;
}

export default function SuggestedRepos({ repos, topRepoId }: SuggestedReposProps) {
  // Filter out the top repo and show next 5
  const otherRepos = repos.filter(r => r !== topRepoId).slice(0, 6);

  if (otherRepos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">More Recommendations</h2>
        <p className="text-[#8b949e] mt-1">Other repositories that match your interests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherRepos.map((repoId, index) => {
          const [owner, repo] = repoId.split('/');
          
          return (
            <div
              key={repoId}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 hover:border-[#2f81f7]/50 hover:shadow-md hover:shadow-[#2f81f7]/5 transition-all group"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-[#2f81f7] transition-colors truncate">
                    {repo}
                  </h3>
                  <p className="text-sm text-[#6e7681] truncate">{owner}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>-</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>-</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#30363d] hover:bg-[#161b22]"
                  onClick={() => window.open(`https://github.com/${repoId}`, '_blank')}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  Explore
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
