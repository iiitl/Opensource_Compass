"use client";

import { useEffect, useState } from "react";
import { getRecommendations, Recommendation } from "@/lib/api/core-service";
import RecommendationHero from "./components/recommendationhero";
import FeaturedIssues from "./components/featuredissues";
import SuggestedRepos from "./components/suggestedrepos";
import RecommendationsSkeleton from "./components/recommendationsskeleton";
import RecommendationsEmpty from "./components/recommendationsempty";
import { useAuth } from "@/contexts/auth-context"; // Added import

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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">AI-Powered Recommendations</h1>
        <p className="mt-2 text-[#8b949e]">
          Discover repositories perfectly matched to your skills and interests
        </p>
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
        <>
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
        </>
      )}
    </div>
  );
}
