import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/data/user";
import { getStartupJobs } from "@/lib/data/job";
import {
  getDepartmentLabel,
  getJobTypeLabel,
  getJobStatusLabel,
  JOB_STATUS_LABELS,
} from "@/lib/schema/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Plus } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-600 border-green-500/20",
  draft: "bg-muted text-muted-foreground",
  paused: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  expired: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default async function StartupJobsPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");

  const jobs = await getStartupJobs(profile.id);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Jobs</h1>
          <p className="mt-1 text-muted-foreground">
            {jobs.length} {jobs.length === 1 ? "position" : "positions"} posted
          </p>
        </div>
        <Button asChild>
          <Link href="/startup/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No jobs yet.</p>
          <Button asChild className="mt-4">
            <Link href="/startup/jobs/new">Post your first job</Link>
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-lg border bg-card p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">{job.title}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    )}
                    {job.job_type && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {getJobTypeLabel(job.job_type)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {job.department && (
                    <Badge variant="secondary">
                      {getDepartmentLabel(job.department)}
                    </Badge>
                  )}
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[job.status] ?? ""}`}
                  >
                    {getJobStatusLabel(job.status)}
                  </span>
                </div>
              </div>
              {job.description && (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {job.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
