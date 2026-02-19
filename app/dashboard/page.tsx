import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-2xl font-semibold md:text-3xl">
              12
            </CardTitle>
          </CardHeader>
        </Card>
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
