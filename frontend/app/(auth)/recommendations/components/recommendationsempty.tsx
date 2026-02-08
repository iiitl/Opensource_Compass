"use client";

import { Sparkles, LogIn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RecommendationsEmptyProps {
  type: "no-auth" | "no-recommendations" | "error";
  onRetry?: () => void;
}

export default function RecommendationsEmpty({ type, onRetry }: RecommendationsEmptyProps) {
  const router = useRouter();

  if (type === "no-auth") {
    return (
      <div className="text-center py-16">
        <LogIn className="h-16 w-16 mx-auto text-[#6e7681] mb-4" />
        <h3 className="text-xl font-semibold mb-2">Login Required</h3>
        <p className="text-[#8b949e] mb-6 max-w-md mx-auto">
          Please log in to get personalized repository recommendations based on your skills and preferences.
        </p>
        <Button onClick={() => router.push('/auth/login')}>
          Log In
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
          We couldn't load your recommendations. Please try again.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // no-recommendations
  return (
    <div className="text-center py-16">
      <Sparkles className="h-16 w-16 mx-auto text-[#6e7681] mb-4" />
      <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
      <p className="text-[#8b949e] mb-6 max-w-md mx-auto">
        We couldn't find any repository recommendations. Try completing your profile or adjusting your preferences.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => router.push('/onboarding')} variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Update Preferences
        </Button>
        {onRetry && (
          <Button onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
