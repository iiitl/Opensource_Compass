import { ReactNode } from "react";

export function SolutionCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 flex items-center justify-center rounded-md bg-[#0d1117] border border-[#30363d]">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-[#3fb950]">
          {title}
        </h3>
      </div>

      <p className="text-sm text-[#8b949e] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
