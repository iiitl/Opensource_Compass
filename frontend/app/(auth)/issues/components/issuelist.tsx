import IssueCard from "./issuecard";

export default function IssueList() {
  // Mock data for now
  const issues = Array.from({ length: 4 });

  if (issues.length === 0) {
    return (
      <div className="border border-[#30363d] rounded-xl p-8 text-center">
        <p className="text-[#8b949e]">
          You haven’t saved any issues yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((_, idx) => (
        <IssueCard key={idx} />
      ))}
    </div>
  );
}

