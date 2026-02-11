"use client";

import { SearchX, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  type: "no-repos" | "no-preferences" | "error";
  onRetry?: () => void;
}

export default function EmptyState({ type, onRetry }: EmptyStateProps) {
  const router = useRouter();

  if (type === "no-preferences") {
    return (
      <div className="text-center py-16">
        <Settings className="h-16 w-16 mx-auto text-[#6e7681] mb-4" />
        <h3 className="text-xl font-semibold mb-2">No preferences set</h3>
        <p className="text-[#8b949e] mb-6 max-w-md mx-auto">
          Complete your onboarding to get personalized repository recommendations based on your interests.
        </p>
        <Button onClick={() => router.push('/onboarding')}>
          Complete Onboarding
        </Button>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
        <p className="text-[#8b949e] mb-6 max-w-md mx-auto">
          We couldn't load repositories. Please try again.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // no-repos
  return (
    <div className="text-center py-16">
      <SearchX className="h-16 w-16 mx-auto text-[#6e7681] mb-4" />
      <h3 className="text-xl font-semibold mb-2">No repositories found</h3>
      <p className="text-[#8b949e] mb-6 max-w-md mx-auto">
        We couldn't find repositories matching your current filters. Try broadening your search by:
      </p>
      <ul className="text-sm text-[#8b949e] mb-6 max-w-md mx-auto text-left list-disc list-inside space-y-1">
        <li>Adding more programming languages</li>
        <li>Selecting different topics</li>
        <li>Changing your experience level</li>
      </ul>
      <Button onClick={() => router.push('/onboarding')} variant="outline">
        <Settings className="h-4 w-4 mr-2" />
        Edit Preferences
      </Button>
    </div>
  );
}
