import { Button } from "@/components/ui/button";

export default function StickyActionBar({
  isValid,
  onContinue,
  isLoading = false,
  error = null,
}: {
  isValid: boolean;
  onContinue: () => void;
  isLoading?: boolean;
  error?: string | null;
}) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0d1117]/80 backdrop-blur border-t border-[#30363d] py-4">
      <div className="max-w-3xl mx-auto px-6">
        {error && (
          <div className="mb-2 text-sm text-red-400 text-right">
            ⚠️ {error}
          </div>
        )}
        <div className="flex justify-end">
          <Button
            onClick={onContinue}
            disabled={!isValid || isLoading || !!error}
            size="lg"
            className={`px-8 transition-all duration-300 ${
              isValid && !isLoading && !error
                ? "bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] shadow-lg shadow-green-900/20 hover:shadow-green-900/40 text-white transform hover:scale-105"
                : "bg-[#30363d] cursor-not-allowed opacity-50"
            }`}
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
