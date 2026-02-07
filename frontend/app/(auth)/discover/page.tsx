"use client";

import { useEffect, useState } from "react";
import { searchRepositories, Repository } from "@/lib/api/github-service";
import DiscoverHero from "./components/discoverhero";
import ActiveFilters from "./components/activefilters";
import RepoGrid from "../issues/components/repogrid";
import SkeletonCard from "./components/skeletoncard";
import EmptyState from "./components/emptystate";

export default function DiscoverPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Preferences
  const [languages, setLanguages] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("Beginner");
  const [username, setUsername] = useState<string | null>(null);

  const loadRepos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's preferences from localStorage
      const techStackStr = localStorage.getItem("techStack");
      const topicsStr = localStorage.getItem("topics");
      const experienceLevelStr = localStorage.getItem("experienceLevel") || "Beginner";
      const usernameStr = localStorage.getItem("githubUsername");
      
      const parsedLanguages = techStackStr ? JSON.parse(techStackStr) : [];
      const parsedTopics = topicsStr ? JSON.parse(topicsStr) : [];
      
      setLanguages(parsedLanguages);
      setTopics(parsedTopics);
      setExperienceLevel(experienceLevelStr);
      setUsername(usernameStr);
      
      // Fetch repositories
      const repositories = await searchRepositories(parsedLanguages, [], parsedTopics);
      setRepos(repositories);
    } catch (err) {
      console.error("Failed to load repositories:", err);
      setError("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);

  // Check if user has set preferences
  const hasPreferences = languages.length > 0 || topics.length > 0;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <DiscoverHero
        username={username}
        repoCount={repos.length}
        onRefresh={loadRepos}
        isLoading={loading}
      />

      {/* Active Filters */}
      {hasPreferences && !loading && (
        <ActiveFilters
          languages={languages}
          topics={topics}
          experienceLevel={experienceLevel}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <EmptyState type="error" onRetry={loadRepos} />
      )}

      {/* No Preferences State */}
      {!hasPreferences && !loading && !error && (
        <EmptyState type="no-preferences" />
      )}

      {/* No Repos Found State */}
      {hasPreferences && repos.length === 0 && !loading && !error && (
        <EmptyState type="no-repos" />
      )}

      {/* Repo Grid */}
      {repos.length > 0 && !loading && !error && (
        <RepoGrid repos={repos} />
      )}
    </div>
  );
}
