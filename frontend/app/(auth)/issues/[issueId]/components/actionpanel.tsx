import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function ActionPanel() {
  return (
    <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-[#30363d]">
      <Button
        className="bg-[#238636] hover:bg-[#2ea043]"
      >
        <Github className="h-4 w-4 mr-2" />
        Open on GitHub
      </Button>

      <Button
        variant="secondary"
        className="bg-[#161b22]"
      >
        Mark as In Progress
      </Button>

      <Button
        variant="outline"
        className="border-[#30363d]"
      >
        Save Issue
      </Button>
    </div>
  );
}
