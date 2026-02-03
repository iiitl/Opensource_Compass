export default function AIExplanationCard() {
  return (
    <div className="bg-[#161b22] border border-[#2f81f7] rounded-xl p-6 space-y-5">
      <h2 className="text-xl font-semibold">
        AI explanation
      </h2>

      <div className="space-y-4 text-sm text-[#c9d1d9]">
        <div>
          <p className="font-medium mb-1">
            What this issue means
          </p>
          <p className="text-[#8b949e]">
            The application fails to correctly refresh authentication tokens
            when the session expires, causing users to be logged out unexpectedly.
          </p>
        </div>

        <div>
          <p className="font-medium mb-1">
            Skills required
          </p>
          <p className="text-[#8b949e]">
            Basic TypeScript, understanding of authentication flows,
            and familiarity with middleware.
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <span className="px-2 py-1 rounded bg-[#0d1117] border border-[#30363d]">
            Difficulty: Easy
          </span>
          <span className="px-2 py-1 rounded bg-[#0d1117] border border-[#30363d]">
            Beginner-friendly
          </span>
        </div>
      </div>
    </div>
  );
}
