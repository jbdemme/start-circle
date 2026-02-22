import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TalentDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Talent Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome! Discover opportunities and connect with startups.
        </p>
      </div>

      {/* Placeholder Content */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Your talent dashboard is being set up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will show your job applications, saved startups, and
            personalized recommendations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
