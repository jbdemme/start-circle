import {
  StatsCards,
  RecentApplicationsPreview,
  ActiveJobsPreview,
  TalentPoolPreview,
  RecentActivity,
  QuickActions,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your hiring pipeline.
        </p>
      </div>

      {/* Stats Cards Row */}
      <StatsCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <RecentApplicationsPreview />
          <ActiveJobsPreview />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <TalentPoolPreview />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
