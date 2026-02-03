import { Button } from "@/components/ui/button";

export default function StickyActionBar({
  isValid,
}: {
  isValid: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0d1117]/80 backdrop-blur border-t border-[#30363d] py-4">
      <div className="max-w-3xl mx-auto px-6 flex justify-end">
        <Button
          disabled={!isValid}
          className={`px-6 ${
            isValid
              ? "bg-[#2f81f7]"
              : "bg-[#30363d] cursor-not-allowed"
          }`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
