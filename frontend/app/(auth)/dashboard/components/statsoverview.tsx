import { FolderGit2, Bug, GitPullRequest } from "lucide-react";

const stats = [
  {
    label: "Repositories explored",
    value: 12,
    icon: FolderGit2,
  },
  {
    label: "Issues saved",
    value: 7,
    icon: Bug,
  },
  {
    label: "PRs submitted",
    value: 2,
    icon: GitPullRequest,
  },
];

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-[#161b22] border border-[#30363d] flex items-center justify-center">
                <Icon className="h-5 w-5 text-[#2f81f7]" />
              </div>
              <div>
                <p className="text-xl font-semibold">
                  {stat.value}
                </p>
                <p className="text-sm text-[#8b949e]">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
