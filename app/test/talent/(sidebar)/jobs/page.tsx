import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TalentJobsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Browse Jobs</CardTitle>
          <CardDescription>
            Discover opportunities from startups on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display all available job listings from startups.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
