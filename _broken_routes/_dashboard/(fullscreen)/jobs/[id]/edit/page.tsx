// import { JobForm } from "@/components/forms/new_job_form";
// import { getJobById } from "@/lib/data/job";
// import { getMyProfile } from "@/lib/data/user";
// import { notFound } from "next/navigation";

// interface EditJobPageProps {
//   params: Promise<{ id: string }>;
// }

// export default async function EditJobPage({ params }: EditJobPageProps) {
//   const { id } = await params;
//   const profile = await getMyProfile();
//   const job = await getJobById(id);

//   if (!profile || !job) {
//     notFound();
//   }

//   // Ensure the user owns this job
//   if (job.startup_id !== profile.id) {
//     notFound();
//   }

//   return (
//     <div className="flex justify-center items-center p-10 pb-0">
//       <JobForm
//         startupId={profile.id}
//         initialData={job}
//         jobId={String(job.id)}
//       />
//     </div>
//   );
// }
