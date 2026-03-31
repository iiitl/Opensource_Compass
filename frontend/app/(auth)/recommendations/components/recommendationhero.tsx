"use client";

import { ExternalLink, Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLevelBadgeColor } from "@/lib/api/core-service";

interface RecommendationHeroProps {
  repoId: string;
  score: number;
  level: string;
  reasons: string[];
}

export default function RecommendationHero({ repoId, score, level, reasons }: RecommendationHeroProps) {
  const [owner, repo] = repoId.split('/');
  const badgeColors = getLevelBadgeColor(level);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22]/60 backdrop-blur-xl shadow-2xl">
      {/* Subtle ambient gradients */}
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Identity & Meta */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-900/20 border-blue-800/30 text-blue-400">
                        <Sparkles className="h-3 w-3" />
                         Top Match
                    </div>
                
                    {/* Compact Score Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-[#0d1117] border-[#30363d] text-[#8b949e]" title="Compatibility Score">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {score}% Match
                    </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 break-all flex items-center gap-3">
                    {repo}
                    <span className="text-lg font-normal text-[#8b949e]">/ {owner}</span>
                </h1>

                <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border"
                         style={{
                           backgroundColor: badgeColors.bg,
                           borderColor: badgeColors.border,
                           color: badgeColors.text,
                         }}>
                        {level === 'beginner' && '🌱'}
                        {level === 'intermediate' && '🎯'}
                        {level === 'advanced' && '🚀'}
                        <span className="capitalize">{level}</span>
                     </div>
                </div>
                
                <div className="flex gap-3">
                    <Button
                        className="bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white shadow-lg shadow-green-900/20 h-10 px-6"
                        onClick={() => window.open(`https://github.com/${repoId}`, '_blank')}
                    >
                        <GitHubIcon className="mr-2 h-4 w-4" />
                        View on GitHub
                    </Button>
                    <Button
                        variant="secondary"
                        className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] h-10"
                        onClick={() => window.location.href = '#issues'}
                    >
                        See Good First Issues
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* AI Analysis - Compact List */}
            <div className="md:w-1/2 bg-[#0d1117]/40 rounded-xl border border-[#30363d]/50 p-5">
               <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                 <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                 Why this repository?
               </h3>
               
               <div className="grid gap-2">
                  {reasons.slice(0, 4).map((reason, i) => (
                     <div 
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-[#c9d1d9] group"
                     >
                        <Check className="h-4 w-4 text-[#2f81f7] mt-0.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="leading-snug">{reason}</span>
                     </div>
                  ))}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    )
}
