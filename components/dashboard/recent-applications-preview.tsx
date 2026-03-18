// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";

// export interface Application {
//   id: string;
//   candidateName: string;
//   candidateAvatar?: string;
//   jobTitle: string;
//   appliedAt: Date;
//   status: "new" | "reviewed" | "shortlisted" | "rejected";
// }

// interface RecentApplicationsPreviewProps {
//   applications?: Application[];
// }

// const defaultApplications: Application[] = [
//   {
//     id: "1",
//     candidateName: "Sarah Chen",
//     jobTitle: "Senior ML Engineer",
//     appliedAt: new Date("2026-02-19"),
//     status: "new",
//   },
//   {
//     id: "2",
//     candidateName: "Marcus Johnson",
//     jobTitle: "Founders Associate",
//     appliedAt: new Date("2026-02-18"),
//     status: "reviewed",
//   },
//   {
//     id: "3",
//     candidateName: "Elena Rodriguez",
//     jobTitle: "GTM Intern",
//     appliedAt: new Date("2026-02-18"),
//     status: "shortlisted",
//   },
//   {
//     id: "4",
//     candidateName: "David Kim",
//     jobTitle: "Junior AI Engineer",
//     appliedAt: new Date("2026-02-17"),
//     status: "new",
//   },
// ];

// const statusColors: Record<Application["status"], string> = {
//   new: "bg-blue-100 text-blue-800",
//   reviewed: "bg-yellow-100 text-yellow-800",
//   shortlisted: "bg-green-100 text-green-800",
//   rejected: "bg-red-100 text-red-800",
// };

// function formatRelativeTime(date: Date): string {
//   const now = new Date();
//   const diffInDays = Math.floor(
//     (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
//   );

//   if (diffInDays === 0) return "Today";
//   if (diffInDays === 1) return "Yesterday";
//   if (diffInDays < 7) return `${diffInDays} days ago`;
//   return date.toLocaleDateString();
// }

// function getInitials(name: string): string {
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();
// }

// export function RecentApplicationsPreview({
//   applications = defaultApplications,
// }: RecentApplicationsPreviewProps) {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <div>
//           <CardTitle>Recent Applications</CardTitle>
//           <CardDescription>
//             Latest applications from pre-vetted talent
//           </CardDescription>
//         </div>
//         <Button variant="ghost" size="sm" asChild>
//           <Link href="/startup/jobs" className="gap-1">
//             View all
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//         </Button>
//       </CardHeader>
//       <CardContent className="flex-1">
//         <div className="space-y-4">
//           {applications.map((application) => (
//             <div
//               key={application.id}
//               className="flex items-center justify-between rounded-lg border p-3"
//             >
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-9 w-9">
//                   <AvatarImage
//                     src={application.candidateAvatar}
//                     alt={application.candidateName}
//                   />
//                   <AvatarFallback>
//                     {getInitials(application.candidateName)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="text-sm font-medium">
//                     {application.candidateName}
//                   </p>
//                   <p className="text-muted-foreground text-xs">
//                     {application.jobTitle}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Badge
//                   variant="secondary"
//                   className={statusColors[application.status]}
//                 >
//                   {application.status}
//                 </Badge>
//                 <span className="text-muted-foreground text-xs">
//                   {formatRelativeTime(application.appliedAt)}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
