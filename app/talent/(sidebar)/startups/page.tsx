import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TalentStartupsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Browse Startups</CardTitle>
          <CardDescription>
            Discover and connect with startups on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display all startups on the platform for direct
            contact.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
