"use client";

import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Funnel, Plus } from "lucide-react";

import { columns, Job } from "./columns";
import { DataTable } from "./data-table";
import { DataTable1 } from "@/components/data-table1";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { newJob } from "@/lib/actions";
import { getMyProfile } from "@/lib/data/user";
import { use } from "react";
import { JobListingsTable } from "@/components/job-listings-table";
import { type JobListing, DEPARTMENT, JOB_TYPE } from "@/lib/types/job";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = searchParams?.page || 1;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-2xl font-bold">Job Postings</CardTitle>
            <CardDescription>
              Manage your active listings and track incoming applications.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Listing
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <SearchInput />
            <div className="flex gap-4">
              {/* Filter (Popover) */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Funnel />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end">
                  <PopoverHeader>
                    <PopoverTitle>Filter</PopoverTitle>
                    <PopoverDescription>
                      Narrow down your job listings
                    </PopoverDescription>
                  </PopoverHeader>
                  <FieldGroup className="gap-4">
                    <Field orientation="horizontal">
                      <FieldLabel>Status</FieldLabel>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full max-w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel>Department</FieldLabel>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full max-w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">General</SelectItem>
                          <SelectItem value="paused">Tech</SelectItem>
                          <SelectItem value="expired">GTM</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </PopoverContent>
              </Popover>

              {/* Sorting Select */}
              <Field orientation="horizontal" className="flex-1">
                <FieldLabel className="text-nowrap">Sort by:</FieldLabel>
                <Select defaultValue="new">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Newest</SelectItem>
                    <SelectItem value="old">Oldest</SelectItem>
                    <SelectItem value="applications">Applications</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div>Hello these are the job listings fitting to the search.</div>
        </CardContent>
      </Card>
    </div>
  );
}

async function getData(): Promise<Job[]> {
  // Fetch data from API here
  // FOR NOW MOCK DATA
  return [
    {
      id: "asd7dfh",
      title: "Senior ML Engineer",
      department: DEPARTMENT.TECH,
      jobType: JOB_TYPE.FULL_TIME,
      location: "remote",
      status: "active",
      posted: new Date("2025-02-10"),
    },
    {
      id: "asd7dfh",
      title: "Junior AI Engineer",
      department: DEPARTMENT.TECH,
      jobType: JOB_TYPE.FULL_TIME,
      location: "Vienna",
      status: "draft",
      posted: new Date("2026-02-12"),
    },
    {
      id: "asd7dfh",
      title: "Founders Associate",
      department: DEPARTMENT.OPERATIONS,
      jobType: JOB_TYPE.INTERNSHIP,
      location: "Munich",
      status: "paused",
      posted: new Date("2026-02-18"),
    },
    {
      id: "asd7dfh",
      title: "GTM Intern",
      department: DEPARTMENT.SALES_GTM,
      jobType: JOB_TYPE.INTERNSHIP,
      location: "Vienna",
      status: "expired",
      posted: new Date("2026-01-01"),
    },
  ];
}

// export default async function DemoPage() {
//   const data = await getData();

//   const profile = await getMyProfile();

//   const newJobWithUser = newJob.bind(null, profile.id);

//   return (
//     <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//       <Card className="">
//         <CardHeader>
//           <CardTitle className="text-2xl md:text-4xl">Job Postings</CardTitle>
//           <CardDescription>
//             A list of all your job postings. You can view, sort, edit and delete
//             them.
//           </CardDescription>
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button>Add a new job</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-sm">
//               <form action={newJobWithUser}>
//                 <DialogHeader>
//                   <DialogTitle>Add Job Listing</DialogTitle>
//                   <DialogDescription>
//                     Add a new job listing. Click save when you are done.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <FieldGroup>
//                   <Field>
//                     <Label htmlFor="job-title">Job Title</Label>
//                     <Input
//                       id="job-title"
//                       name="title"
//                       placeholder="Founders Associate"
//                     />
//                   </Field>
//                   <Field>
//                     <Label htmlFor="description">Description</Label>
//                     <Textarea
//                       id="description"
//                       name="description"
//                       placeholder="Add description..."
//                       className="md:h-40"
//                     />
//                   </Field>
//                   <Field>
//                     <Label htmlFor="location">Location</Label>
//                     <Input
//                       id="location"
//                       name="location"
//                       placeholder="eg. Vienna, Remote, Hybrid (Vienna)"
//                     />
//                   </Field>
//                 </FieldGroup>
//                 <DialogFooter>
//                   <DialogClose asChild>
//                     <Button variant="outline">Cancel</Button>
//                   </DialogClose>
//                   <Button type="submit">Save</Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </CardHeader>
//         <CardContent>
//           <DataTable columns={columns} data={data} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// Sample data for testing JobListingsTable
const sampleJobListings: JobListing[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    description:
      "We are looking for an experienced frontend developer to join our team and help build amazing user experiences.",
    location: "Berlin, Germany",
    department: DEPARTMENT.TECH,
    jobType: JOB_TYPE.FULL_TIME,
    status: "active",
  },
  {
    id: "2",
    title: "Product Marketing Manager",
    description:
      "Join our marketing team to drive product awareness and go-to-market strategies.",
    location: "Remote",
    department: DEPARTMENT.SALES_GTM,
    jobType: JOB_TYPE.FULL_TIME,
    status: "active",
  },
  {
    id: "3",
    title: "Backend Engineer",
    description:
      "Build and maintain scalable backend services for our growing platform.",
    location: "Munich, Germany",
    department: DEPARTMENT.TECH,
    jobType: JOB_TYPE.FULL_TIME,
    status: "paused",
  },
  {
    id: "4",
    title: "Operations Intern",
    description:
      "Great opportunity for students to gain hands-on experience in operations management.",
    location: "Hamburg, Germany",
    department: DEPARTMENT.OPERATIONS,
    jobType: JOB_TYPE.INTERNSHIP,
    status: "draft",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    description:
      "Manage and improve our CI/CD pipelines and cloud infrastructure.",
    location: "Frankfurt, Germany",
    department: DEPARTMENT.TECH,
    jobType: JOB_TYPE.FULL_TIME,
    status: "expired",
  },
  {
    id: "6",
    title: "Sales Development Representative",
    description:
      "Drive outbound sales efforts and qualify leads for the sales team.",
    location: "Remote",
    department: DEPARTMENT.SALES_GTM,
    jobType: JOB_TYPE.FULL_TIME,
    status: "active",
  },
  {
    id: "7",
    title: "Working Student - HR",
    description:
      "Support the HR team with recruiting, onboarding, and employee engagement initiatives.",
    location: "Berlin, Germany",
    department: DEPARTMENT.OPERATIONS,
    jobType: JOB_TYPE.PART_TIME_WORKING_STUDENT,
    status: "active",
  },
  {
    id: "8",
    title: "Data Analyst",
    description:
      "Analyze business data and provide insights to support decision-making.",
    location: "Cologne, Germany",
    department: DEPARTMENT.OTHER,
    jobType: JOB_TYPE.FULL_TIME,
    status: "paused",
  },
  {
    id: "9",
    title: "UX Designer",
    description:
      "Design intuitive and beautiful user interfaces for our web and mobile applications.",
    location: "Remote",
    department: DEPARTMENT.TECH,
    jobType: JOB_TYPE.FULL_TIME,
    status: "draft",
  },
  {
    id: "10",
    title: "Customer Success Manager",
    description:
      "Ensure customer satisfaction and drive retention through excellent support.",
    location: "Munich, Germany",
    department: DEPARTMENT.SALES_GTM,
    jobType: JOB_TYPE.FULL_TIME,
    status: "expired",
  },
];

export default function JobListingsPage() {
  const router = useRouter();

  const handleEdit = (id: string) => {
    console.log("Edit job:", id);
    alert(`Edit job with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Delete job:", id);
    alert(`Delete job with ID: ${id}`);
  };

  const handleCreate = () => {
    console.log("Create new job");
    router.push("/dashboard/jobs/new");
  };

  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-bold">Job Listings Table</h1>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Add New Job
        </Button>
      </div>
      <JobListingsTable
        data={sampleJobListings}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
