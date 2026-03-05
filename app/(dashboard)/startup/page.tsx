import {
  StatsCards,
  RecentApplicationsPreview,
  ActiveJobsPreview,
  TalentPoolPreview,
  RecentActivity,
  QuickActions,
} from "@/components/dashboard";

export default function StartupDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Startup Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your hiring pipeline and discover top talent.
          </p>
        </div>
      </div>

      <StatsCards />

      <QuickActions />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-1 lg:col-span-4 space-y-6">
          <RecentApplicationsPreview />
          <ActiveJobsPreview />
        </div>
        <div className="md:col-span-1 lg:col-span-3 space-y-6">
          <TalentPoolPreview />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
