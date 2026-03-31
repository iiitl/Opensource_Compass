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
    <div className="group relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 overflow-hidden transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-900/10">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 flex items-center justify-center rounded-md bg-[#0d1117] border border-[#30363d] group-hover:border-green-500/50 transition-colors">
            {icon}
          </div>
          <h3 className="text-base font-semibold text-[#3fb950] group-hover:text-green-400 transition-colors">
            {title}
          </h3>
        </div>

        <p className="text-sm text-[#8b949e] leading-relaxed group-hover:text-[#a0a8b1] transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
}
