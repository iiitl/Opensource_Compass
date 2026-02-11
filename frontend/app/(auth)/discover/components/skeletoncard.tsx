export default function SkeletonCard() {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 animate-pulse">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-6 bg-[#161b22] rounded w-3/4"></div>
        <div className="h-4 bg-[#161b22] rounded w-1/2"></div>
        <div className="h-4 bg-[#161b22] rounded w-full"></div>
        <div className="h-4 bg-[#161b22] rounded w-5/6"></div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 bg-[#161b22] rounded w-20"></div>
        <div className="flex gap-3">
          <div className="h-4 bg-[#161b22] rounded w-12"></div>
          <div className="h-4 bg-[#161b22] rounded w-16"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <div className="h-9 bg-[#161b22] rounded flex-1"></div>
        <div className="h-9 bg-[#161b22] rounded w-20"></div>
      </div>
    </div>
  );
}
