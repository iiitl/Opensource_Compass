"use client";

import { Repository } from "@/lib/api/github-service";
import { ExternalLink, Star, GitFork, Code, Calendar } from "lucide-react";
import Link from "next/link";

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

interface RepoCardProps {
  repo: Repository;
}

function RepoCard({ repo }: RepoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const formatStars = (stars?: number) => {
    if (!stars) return "0";
    if (stars >= 1000) {
      return `${(stars / 1000).toFixed(1)}k`;
    }
    return stars.toString();
  };

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#58a6ff] hover:shadow-lg hover:shadow-[#58a6ff]/10 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#58a6ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header with external link */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Code className="h-4 w-4 text-[#8b949e] shrink-0" />
              <span className="text-xs text-[#8b949e] truncate">{repo.owner}</span>
            </div>
            <h3 className="text-lg font-bold text-[#58a6ff] group-hover:text-[#79c0ff] transition-colors truncate">
              {repo.name}
            </h3>
          </div>
          <div className="ml-3 p-2 rounded-lg bg-[#21262d] border border-[#30363d] group-hover:border-[#58a6ff] group-hover:bg-[#58a6ff]/10 transition-all">
            <ExternalLink className="h-4 w-4 text-[#8b949e] group-hover:text-[#58a6ff]" />
          </div>
        </div>

        {/* Description */}
        {repo.description ? (
          <p className="text-sm text-[#8b949e] mb-5 line-clamp-2 min-h-[40px]">
            {repo.description}
          </p>
        ) : (
          <p className="text-sm text-[#6e7681] italic mb-5 min-h-[40px]">
            No description available
          </p>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4">
          {/* Stars */}
          {repo.stargazers_count !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d]">
              <Star className="h-3.5 w-3.5 text-[#f1e05a] fill-[#f1e05a]" />
              <span className="text-xs font-semibold text-[#c9d1d9]">
                {formatStars(repo.stargazers_count)}
              </span>
            </div>
          )}
          
          {/* Language */}
          {repo.language && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d]">
              <div className="h-2.5 w-2.5 rounded-full bg-[#3fb950]" />
              <span className="text-xs font-medium text-[#c9d1d9]">{repo.language}</span>
            </div>
          )}

          {/* Updated */}
          {repo.updated_at && (
            <div className="flex items-center gap-1.5 ml-auto">
              <Calendar className="h-3.5 w-3.5 text-[#6e7681]" />
              <span className="text-xs text-[#6e7681]">{formatDate(repo.updated_at)}</span>
            </div>
          )}
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-[#21262d]">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="px-2.5 py-1 text-xs font-medium bg-[#388bfd]/10 text-[#58a6ff] border border-[#388bfd]/20 rounded-md hover:bg-[#388bfd]/20 transition-colors"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="px-2.5 py-1 text-xs font-medium text-[#8b949e]">
                +{repo.topics.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
