import { getActiveJobs } from "@/lib/data/job";
import { getDepartmentLabel, getJobTypeLabel } from "@/lib/schema/job";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase } from "lucide-react";

export default async function TalentJobsPage() {
  const jobs = await getActiveJobs();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Open Positions</h1>
        <p className="mt-1 text-muted-foreground">
          {jobs.length} active {jobs.length === 1 ? "role" : "roles"} from startups in the circle
        </p>
      </div>

      {jobs.length === 0 ? (
        <p className="text-muted-foreground">No open positions right now. Check back soon.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50"
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
                {job.department && (
                  <Badge variant="secondary" className="shrink-0">
                    {getDepartmentLabel(job.department)}
                  </Badge>
                )}
              </div>
              {job.description && (
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
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
