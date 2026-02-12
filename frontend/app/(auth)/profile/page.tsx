"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getPreferences, UserPreferences } from "@/lib/api/preferences";
import { useRouter } from "next/navigation";
import { Github, LogOut, Settings, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { username, avatar, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getPreferences();
        setPreferences(prefs);
      } catch (error) {
        console.error("Failed to load preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadPreferences();
    }
  }, [authLoading]);

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2f81f7]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#c9d1d9]">
          Profile
        </h1>
        <p className="mt-2 text-[#8b949e]">
          View your account information and preferences
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-[#161b22] border-2 border-[#30363d] flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt={username || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-2xl font-semibold text-[#8b949e]">
                  {username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-xl font-semibold text-[#c9d1d9]">
                {username || "User"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Github className="h-4 w-4 text-[#8b949e]" />
                <span className="text-sm text-[#8b949e]">
                  Connected via GitHub
                </span>
              </div>
              {preferences?.experienceLevel && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#238636]/10 border border-[#238636]/20 text-[#3fb950]">
                    {preferences.experienceLevel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#21262d] border border-[#30363d] text-sm text-[#c9d1d9] hover:bg-[#30363d] transition-colors"
            >
              <Settings className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#21262d] border border-[#30363d] text-sm text-[#c9d1d9] hover:bg-[#da3633]/10 hover:border-[#da3633]/30 hover:text-[#f85149] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#c9d1d9] mb-4">
          Your Preferences
        </h3>

        {/* Languages */}
        {preferences?.languages && preferences.languages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[#8b949e] mb-3">
              Programming Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {preferences.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-[#30363d] text-sm text-[#c9d1d9]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {preferences?.topics && preferences.topics.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-[#8b949e] mb-3">
              Topics & Domains
            </h4>
            <div className="flex flex-wrap gap-2">
              {preferences.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-[#30363d] text-sm text-[#c9d1d9]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!preferences?.languages || preferences.languages.length === 0) &&
          (!preferences?.topics || preferences.topics.length === 0) && (
            <div className="text-center py-8">
              <p className="text-[#8b949e] mb-4">
                No preferences set yet
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#238636] text-white hover:bg-[#2ea043] transition-colors"
              >
                <Settings className="h-4 w-4" />
                Set Your Preferences
              </Link>
            </div>
          )}
      </div>

      {/* GitHub Integration Status */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#c9d1d9] mb-4">
          GitHub Integration
        </h3>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#238636]/10 border border-[#238636]/20 flex items-center justify-center">
            <Github className="h-5 w-5 text-[#3fb950]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#c9d1d9]">
              GitHub Account Connected
            </p>
            <p className="text-xs text-[#8b949e]">
              OAuth access token active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
