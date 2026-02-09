"use client";

import { ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreIndicator from "./scoreindicator";
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
    <div className="bg-gradient-to-br from-[#161b22] via-[#0d1117] to-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2f81f7]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3fb950]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-[#2f81f7]" />
              <h2 className="text-lg text-[#8b949e]">Your Top Match</h2>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3 break-words">
              {repo}
            </h1>
            
            <p className="text-[#8b949e] mb-4">
              {owner}
            </p>

            {/* Level Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                 style={{
                   backgroundColor: badgeColors.bg,
                   borderColor: badgeColors.border,
                   color: badgeColors.text,
                   border: '1px solid'
                 }}>
              {level === 'beginner' && '🌱'}
              {level === 'intermediate' && '🎯'}
              {level === 'advanced' && '🚀'}
              <span className="capitalize">{level}</span>
            </div>
          </div>

          {/* Score Indicator */}
          <div className="flex-shrink-0">
            <ScoreIndicator score={score} level={level} />
          </div>
        </div>

        {/* Reasons */}
        {reasons && reasons.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-[#8b949e] mb-4">Why This Repository?</h3>
            <div className="grid gap-3">
              {reasons.map((reason, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 bg-[#0d1117]/50 border border-[#30363d] rounded-lg p-4 hover:border-[#2f81f7]/30 transition-colors"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeIn 0.5s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2f81f7] mt-2 flex-shrink-0"></div>
                  <p className="text-[#e6edf3] leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            className="bg-[#2f81f7] hover:bg-[#1f6feb] text-white"
            onClick={() => window.open(`https://github.com/${repoId}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on GitHub
          </Button>
          
          <Button
            variant="outline"
            className="border-[#30363d] hover:bg-[#161b22]"
            onClick={() => window.location.href = '#issues'}
          >
            See Good First Issues
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
