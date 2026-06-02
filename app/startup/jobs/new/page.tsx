import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/data/user";
import { JobForm } from "@/components/forms/job-form";

export default async function NewJobPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Post a New Job</h1>
        <p className="mt-1 text-muted-foreground">
          Jobs are saved as drafts — publish them when you're ready.
        </p>
      </div>
      <JobForm startupId={profile.id} />
    </main>
  );
}
