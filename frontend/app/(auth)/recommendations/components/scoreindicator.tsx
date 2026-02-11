"use client";

import { Sparkles, GitBranch, Users, TrendingUp } from "lucide-react";

interface ScoreIndicatorProps {
  score: number;
  level: string;
}

export default function ScoreIndicator({ score, level }: ScoreIndicatorProps) {
  // Color based on score
  const getScoreColor = () => {
    if (score >= 90) return { stroke: '#3fb950', bg: '#3fb950/20' };
    if (score >= 70) return { stroke: '#58a6ff', bg: '#58a6ff/20' };
    if (score >= 50) return { stroke: '#d29922', bg: '#d29922/20' };
    return { stroke: '#f85149', bg: '#f85149/20' };
  };

  const colors = getScoreColor();
  const circumference = 2 * Math.PI * 54; // radius = 54
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 mx-auto">
      {/* SVG Circle */}
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r="54"
          stroke="#30363d"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r="54"
          stroke={colors.stroke}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold" style={{ color: colors.stroke }}>
          {score}
        </div>
        <div className="text-xs text-[#8b949e] mt-1">Match Score</div>
      </div>
    </div>
  );
}
