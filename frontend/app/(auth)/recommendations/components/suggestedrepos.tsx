"use client";

import { useEffect, useState } from "react";
import { Repository, fetchRepository } from "@/lib/api/github-service";
import RepoCard from "../../discover/components/repocard";
import SkeletonCard from "../../discover/components/skeletoncard";

interface SuggestedReposProps {
  repos: string[];
  topRepoId: string;
}

export default function SuggestedRepos({ repos, topRepoId }: SuggestedReposProps) {
  const [detailedRepos, setDetailedRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepos = async () => {
      // Filter out top repo
      const otherRepos = repos.filter(r => r !== topRepoId).slice(0, 6);
      
      if (otherRepos.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = otherRepos.map(async (repoId) => {
          const [owner, name] = repoId.split('/');
          // Add error handling per request so one failure doesn't break all
          try {
            return await fetchRepository(owner, name);
          } catch (e) {
            console.error(`Failed to fetch suggested repo ${repoId}`, e);
            return null;
          }
        });
        
        const results = await Promise.all(promises);
        setDetailedRepos(results.filter((r): r is Repository => r !== null));
      } catch (err) {
        console.error("Failed to load suggested repos", err);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [repos, topRepoId]);

  if (!loading && detailedRepos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">More Recommendations</h2>
        <p className="text-[#8b949e] mt-1">Other repositories that match your interests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Show skeletons while loading
          [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          detailedRepos.map((repo) => (
             <RepoCard key={repo.full_name} repo={repo} />
          ))
        )}
      </div>
    </div>
  );
}
