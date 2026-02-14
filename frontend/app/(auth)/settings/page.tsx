"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getPreferences, savePreferences, UserPreferences } from "@/lib/api/preferences";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, Save } from "lucide-react";

const AVAILABLE_LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust",
  "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin"
];

const AVAILABLE_TOPICS = [
  "Web Development", "Backend", "Frontend", "DevOps",
  "Machine Learning", "AI", "Mobile", "Cloud",
  "Security", "Data Science", "Blockchain", "Game Development"
];

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function SettingsPage() {
  const { username, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Form state
  const [experienceLevel, setExperienceLevel] = useState<string>("Beginner");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const prefs = await getPreferences();
        setExperienceLevel(prefs.experienceLevel || "Beginner");
        setSelectedLanguages(prefs.languages || []);
        setSelectedTopics(prefs.topics || []);
      } catch (err: any) {
        console.error("Failed to load preferences:", err);
        setError("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadPreferences();
    }
  }, [authLoading]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
    setSaved(false);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await savePreferences({
        languages: selectedLanguages,
        topics: selectedTopics,
        experienceLevel,
        githubUsername: username || "",
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Failed to save preferences:", err);
      setError(err.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
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
          Settings
        </h1>
        <p className="mt-2 text-[#8b949e]">
          Customize your preferences to get better repository recommendations
        </p>
      </div>

      {/* Success/Error Messages */}
      {saved && (
        <div className="bg-[#238636]/10 border border-[#238636]/30 rounded-lg p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-[#3fb950]" />
          <p className="text-sm text-[#3fb950]">Preferences saved successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-[#da3633]/10 border border-[#da3633]/30 rounded-lg p-4 flex items-center gap-3">
          <X className="h-5 w-5 text-[#f85149]" />
          <p className="text-sm text-[#f85149]">{error}</p>
        </div>
      )}

      {/* Experience Level */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">
          Experience Level
        </h3>
        <p className="text-sm text-[#8b949e] mb-4">
          Help us recommend projects that match your skill level
        </p>
        <div className="flex gap-3">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => {
                setExperienceLevel(level);
                setSaved(false);
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                experienceLevel === level
                  ? "bg-[#238636] text-white border-2 border-[#238636]"
                  : "bg-[#161b22] text-[#c9d1d9] border-2 border-[#30363d] hover:border-[#8b949e]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Programming Languages */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">
          Programming Languages
        </h3>
        <p className="text-sm text-[#8b949e] mb-4">
          Select the languages you're interested in or want to learn
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLanguages.includes(lang)
                  ? "bg-[#1f6feb] text-white border border-[#1f6feb]"
                  : "bg-[#161b22] text-[#c9d1d9] border border-[#30363d] hover:border-[#8b949e]"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Topics & Domains */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">
          Topics & Domains
        </h3>
        <p className="text-sm text-[#8b949e] mb-4">
          Choose areas of interest for more relevant project suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTopics.includes(topic)
                  ? "bg-[#a371f7] text-white border border-[#a371f7]"
                  : "bg-[#161b22] text-[#c9d1d9] border border-[#30363d] hover:border-[#8b949e]"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#238636] text-white hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Cancel
        </button>
      </div>

      {/* Helpful tip */}
      <div className="bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-lg p-4">
        <p className="text-sm text-[#58a6ff]">
          💡 <strong>Tip:</strong> Your preferences help us find repositories that match your interests.
          You can always update them later!
        </p>
      </div>
    </div>
  );
}
