"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { addToWatchlist, removeFromWatchlist, checkIsWatched } from "@/lib/api/watchlist";
import { IconEye, IconEyeOff, IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";

interface WatchButtonProps {
  owner: string;
  name: string;
}

export function WatchButton({ owner, name }: WatchButtonProps) {
  const { token } = useAuth();
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      checkIsWatched(token, owner, name)
        .then(setIsWatched)
        .catch(() => setIsWatched(false))
        .finally(() => setLoading(false));
    }
  }, [token, owner, name]);

  const toggleWatch = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      if (isWatched) {
        await removeFromWatchlist(token, owner, name);
        setIsWatched(false);
        toast.success("Removed from watchlist");
      } else {
        await addToWatchlist(token, owner, name);
        setIsWatched(true);
        toast.success("Added to watchlist");
      }
    } catch (error) {
      toast.error("Failed to update watchlist");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <button
      onClick={toggleWatch}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        isWatched
          ? "bg-[#1f6feb]/10 text-[#58a6ff] hover:bg-[#1f6feb]/20 border border-[#1f6feb]/50"
          : "bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] border border-[#30363d]"
      }`}
    >
      {loading ? (
        <IconLoader className="w-4 h-4 animate-spin" />
      ) : isWatched ? (
        <IconEyeOff className="w-4 h-4" />
      ) : (
        <IconEye className="w-4 h-4" />
      )}
      {isWatched ? "Unwatch" : "Watch"}
    </button>
  );
}
