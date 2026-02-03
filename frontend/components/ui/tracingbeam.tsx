"use client";

import { ReactNode } from "react";

// A wrapper for entry animation and border accent
export function TracingBeamStep({
  icon,
  title,
  description,
  active,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  active?: boolean;
}) {
  const baseClasses =
    "relative p-6 rounded-xl border transition-all duration-300 ease-out bg-[#0d1117] border-[#30363d]";

  const activeClasses =
    "border-[#2f81f7] shadow-lg shadow-[#2f81f7]/20";

  return (
    <div className={`${baseClasses} ${active ? activeClasses : ""}`}>
      {icon}
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[#8b949e] leading-relaxed">
        {description}
      </p>
    </div>
  );
}



export function ArrowConnector({ direction = "right" }) {
  const isDown = direction === "down";

  return (
    <div
      className={`flex ${
        isDown ? "justify-center py-4" : "items-center px-3"
      }`}
    >
      <svg
        width={isDown ? "24" : "48"}
        height={isDown ? "48" : "24"}
        viewBox={isDown ? "0 0 24 48" : "0 0 48 24"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-60"
      >
        <path
          d={
            isDown
              ? "M12 0v38m0 0l-5-5m5 5l5-5"
              : "M0 12h38m0 0l-5-5m5 5l-5 5"
          }
          stroke="#2f81f7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}


export function WorkflowStepCard({
  icon,
  title,
  description,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 text-left hover:border-[#2f81f7] transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-md bg-[#161b22] border border-[#30363d]">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-[#6e7681]">{subtitle}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-[#8b949e] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
