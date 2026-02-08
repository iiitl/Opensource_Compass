export default function RecommendationsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="h-6 w-32 bg-[#0d1117] rounded"></div>
            <div className="h-10 w-64 bg-[#0d1117] rounded"></div>
            <div className="h-5 w-48 bg-[#0d1117] rounded"></div>
            <div className="h-8 w-24 bg-[#0d1117] rounded-full"></div>
          </div>
          <div className="w-40 h-40 bg-[#0d1117] rounded-full"></div>
        </div>

        {/* Reasons skeleton */}
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#0d1117] border border-[#30363d] rounded-lg"></div>
          ))}
        </div>

        {/* Buttons skeleton */}
        <div className="mt-8 flex gap-4">
          <div className="h-10 w-40 bg-[#0d1117] rounded"></div>
          <div className="h-10 w-40 bg-[#0d1117] rounded"></div>
        </div>
      </div>

      {/* Issues Skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-56 bg-[#161b22] rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 space-y-3">
              <div className="h-5 bg-[#161b22] rounded w-full"></div>
              <div className="h-4 bg-[#161b22] rounded w-3/4"></div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-[#161b22] rounded-full"></div>
                <div className="h-6 w-16 bg-[#161b22] rounded-full"></div>
              </div>
              <div className="h-9 bg-[#161b22] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
