import { Star, Clock, GitFork, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Repository } from "@/lib/api/github-service";
import Link from "next/link";

interface RepoCardProps {
  repo: Repository;
}

const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
};

export default function RepoCard({ repo }: RepoCardProps) {
  const formatStars = (count: number | undefined): string => {
    if (!count && count !== 0) return "0";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const timeSinceUpdate = (dateString: string | undefined): string => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const isRecentlyActive = (dateString: string | undefined): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 30;
  };

  const languageColor = repo.language ? languageColors[repo.language] || "#8b949e" : "#8b949e";

  return (
    <div className="bg-[#0d1117]/60 backdrop-blur-sm border border-[#30363d] rounded-xl p-5 hover:border-[#2f81f7] hover:shadow-lg hover:shadow-[#2f81f7]/10 transition-all flex flex-col h-full group">

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold group-hover:text-[#2f81f7] transition-colors">
            {repo.name}
          </h3>
          {isRecentlyActive(repo.updated_at) && (
            <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full shrink-0">
              Active
            </span>
          )}
        </div>

        <p className="text-sm text-[#6e7681]">
          {repo.owner}
        </p>

        <p className="text-sm text-[#8b949e] line-clamp-2 leading-relaxed">
          {repo.description || "No description available"}
        </p>

        {/* Language Badge */}
        {repo.language && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#161b22] border border-[#30363d] rounded-full text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            <span>{repo.language}</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-5 flex items-center justify-between text-sm text-[#8b949e] border-t border-[#30363d] pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4" />
            <span>{formatStars(repo.stargazers_count)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="text-xs">{timeSinceUpdate(repo.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <Button
          asChild
          variant="default"
          className="flex-1 bg-[#2f81f7] hover:bg-[#2f81f7]/90 text-white border border-transparent"
        >
          <Link href={`/repo/${repo.owner}/${repo.name}/setup`}>
            <Settings className="h-4 w-4 mr-2" />
            Setup
          </Link>
        </Button>
        <Button
          variant="secondary"
          className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d]"
          onClick={() => window.open(repo.html_url, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on GitHub
        </Button>
      </div>
    </div>
  );
}
