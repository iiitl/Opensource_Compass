import StatsOverview from "./components/statsoverview";
import ActiveIssues from "./components/activeissues";
import SavedRepositories from "./components/savedrepo";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Dashboard
        </h1>
        <p className="mt-2 text-[#8b949e] max-w-2xl">
          Track your open-source contributions and continue where you left off.
        </p>
      </div>

      <StatsOverview />
      <ActiveIssues />
      <SavedRepositories />
    </div>
  );
}
