import IssueTabs from "./components/issuetabs";
import IssueList from "./components/issuelist";

export default function IssuesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Your issues
        </h1>
        <p className="mt-2 text-[#8b949e] max-w-2xl">
          Track the open-source issues you’ve saved or are currently working on.
        </p>
      </div>

      {/* Tabs */}
      <IssueTabs />

      {/* Issues */}
      <IssueList />
    </div>
  );
}
