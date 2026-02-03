import { Star, Clock, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RepoCard() {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 flex flex-col justify-between hover:border-[#2f81f7] transition-colors">
      
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          react-awesome-project
        </h3>
        <p className="text-sm text-[#6e7681]">
          facebook / open-source
        </p>

        <p className="mt-2 text-sm text-[#8b949e]">
          Recommended because it uses React, has active maintainers,
          and consistently labels beginner-friendly issues.
        </p>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-center justify-between text-sm text-[#8b949e]">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          JavaScript
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" /> 12k
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> Active
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <Button
          variant="secondary"
          className="flex-1 bg-[#161b22]"
        >
          View Issues
        </Button>
        <Button
          variant="outline"
          className="border-[#30363d]"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
