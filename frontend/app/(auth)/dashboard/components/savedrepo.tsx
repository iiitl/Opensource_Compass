import { Star } from "lucide-react";

const repos = [
  "facebook / react",
  "vercel / next.js",
  "spring-projects / spring-boot",
];

export default function SavedRepositories() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Saved repositories
      </h2>

      {repos.length === 0 ? (
        <div className="border border-[#30363d] rounded-xl p-6 text-center text-[#8b949e]">
          You haven’t saved any repositories yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {repos.map((repo) => (
            <div
              key={repo}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 flex items-center justify-between"
            >
              <span className="text-sm">{repo}</span>
              <Star className="h-4 w-4 text-[#facc15]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
