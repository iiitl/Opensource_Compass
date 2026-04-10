"use client";
import RepoCard from './repocard';
import { Repository } from "@/lib/api/github-service";
interface RepoGridProps {
  repos: Repository[];
}
export default function RepoGrid({ repos }: RepoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {repos.map((repo) => (
        <RepoCard key={repo.full_name} repo={repo} />
      ))}
    </div>
  );
}


