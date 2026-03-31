"use client";

import { useEffect, useState } from "react";
import { getRecommendations, Recommendation } from "@/lib/api/core-service";
import RecommendationHero from "./components/recommendationhero";
import FeaturedIssues from "./components/featuredissues";
import SuggestedRepos from "./components/suggestedrepos";
import RecommendationsSkeleton from "./components/recommendationsskeleton";
import RecommendationsEmpty from "./components/recommendationsempty";
import { useAuth } from "@/contexts/auth-context";
import PageWrapper from "@/components/ui/page-wrapper";

export default function RecommendationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth(); // Removed token
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Loading recommendations...");
      
      // Fetch recommendations (cookies sent automatically via proxy)
      console.log("📡 Calling recommendations API...");
      const data = await getRecommendations();
      console.log("✅ Recommendations received:", data);
      setRecommendation(data);
      
    } catch (err: any) {
      console.error("❌ Failed to load recommendations:", err);
      
      if (err.message?.includes("Unauthorized")) {
        setError("no-auth");
      } else {
        setError("error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth context to initialize
    if (!authLoading && isAuthenticated) {
      loadRecommendations();
    } else if (!authLoading && !isAuthenticated) {
      setError("no-auth");
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  return (
    <PageWrapper className="relative min-h-screen">
      <div className="relative z-10 space-y-8 pb-20">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#30363d]/50 pb-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 inline-block">
                    AI-Powered Recommendations
                </h1>
                <p className="mt-2 text-[#8b949e] text-lg max-w-2xl">
                    Discover repositories perfectly matched to your skills and interests
                </p>
            </div>
            {/* Optional: Add a refresh button or filter here later */}
        </div>

        {/* Loading State */}
        {loading && <RecommendationsSkeleton />}

        {/* Error State - No Auth */}
        {error === "no-auth" && !loading && (
            <RecommendationsEmpty type="no-auth" />
        )}

        {/* Error State - General */}
        {error === "error" && !loading && (
            <RecommendationsEmpty type="error" onRetry={loadRecommendations} />
        )}

        {/* No Recommendations */}
        {!loading && !error && !recommendation && (
            <RecommendationsEmpty type="no-recommendations" onRetry={loadRecommendations} />
        )}

        {/* Success State */}
        {!loading && !error && recommendation && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero - Top Recommendation */}
            <RecommendationHero
                repoId={recommendation.repo_id}
                score={recommendation.score}
                level={recommendation.level}
                reasons={recommendation.reasons}
            />

            {/* Featured Issues */}
            {recommendation.issues && recommendation.issues.length > 0 && (
                <FeaturedIssues
                issues={recommendation.issues}
                repoId={recommendation.repo_id}
                />
            )}

            {/* Suggested Repos */}
            {recommendation.suggested_repos && recommendation.suggested_repos.length > 0 && (
                <SuggestedRepos
                repos={recommendation.suggested_repos}
                topRepoId={recommendation.repo_id}
                />
            )}
            </div>
        )}
      </div>
    </PageWrapper>
  );
}
