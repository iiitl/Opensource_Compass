import RepoCard from "../../discover/components/repocard";
import { Repository } from "@/lib/api/github-service";

interface RepoGridProps {
  repos: Repository[];
}

export default function RepoGrid({ repos }: RepoGridProps) {
  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#8b949e]">No repositories found matching your preferences.</p>
        <p className="text-sm text-[#6e7681] mt-2">Try adjusting your tech stack in your profile.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <RepoCard key={repo.full_name} repo={repo} />
      ))}
    </div>
  );
}
