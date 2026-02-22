import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users } from "lucide-react";
import Link from "next/link";
import {
  type JobListing,
  type JobStatus,
  type Department,
  JOB_STATUS_LABELS,
  DEPARTMENT_LABELS,
} from "@/lib/types/job";

// Re-export for backward compatibility
export type { JobListing } from "@/lib/types/job";

// Extended interface for this component's specific needs
interface ActiveJobItem extends Omit<JobListing, "description" | "jobType"> {
  applicationsCount: number;
  postedAt: Date;
}

interface ActiveJobsPreviewProps {
  jobs?: ActiveJobItem[];
}

const defaultJobs: ActiveJobItem[] = [
  {
    id: "1",
    title: "Senior ML Engineer",
    department: "tech",
    location: "Remote",
    applicationsCount: 18,
    status: "active",
    postedAt: new Date("2026-02-10"),
  },
  {
    id: "2",
    title: "Founders Associate",
    department: "operations",
    location: "Vienna",
    applicationsCount: 24,
    status: "active",
    postedAt: new Date("2026-02-05"),
  },
  {
    id: "3",
    title: "GTM Intern",
    department: "sales-gtm",
    location: "Vienna",
    applicationsCount: 5,
    status: "paused",
    postedAt: new Date("2026-01-28"),
  },
];

const statusStyles: Record<JobStatus, { badge: string; dot: string }> = {
  active: {
    badge: "bg-green-100 text-green-800",
    dot: "bg-green-500",
  },
  paused: {
    badge: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-500",
  },
  draft: {
    badge: "bg-gray-100 text-gray-800",
    dot: "bg-gray-500",
  },
  expired: {
    badge: "bg-red-100 text-red-800",
    dot: "bg-red-500",
  },
};

export function ActiveJobsPreview({
  jobs = defaultJobs,
}: ActiveJobsPreviewProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Job Listings</CardTitle>
          <CardDescription>
            Overview of your current job postings
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/startup/jobs" className="gap-1">
            Manage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{job.title}</span>
                    <Badge
                      variant="secondary"
                      className={statusStyles[job.status].badge}
                    >
                      <span
                        className={`mr-1 h-2 w-2 rounded-full ${statusStyles[job.status].dot}`}
                      />
                      {JOB_STATUS_LABELS[job.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {job.applicationsCount} applications
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
