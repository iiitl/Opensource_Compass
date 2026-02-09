export default function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0d1117]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#30363d] border-t-[#2f81f7]"></div>
        <p className="text-sm text-[#8b949e]">Loading...</p>
      </div>
    </div>
  );
}
