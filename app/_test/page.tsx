"use client";
import { JobListingsTable } from "@/components/job-listings-table";
import { type JobListing } from "@/lib/types/job";

// Sample data for testing JobListingsTable
const sampleJobListings: JobListing[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    description:
      "We are looking for an experienced frontend developer to join our team and help build amazing user experiences.",
    location: "Berlin, Germany",
    department: "tech",
    jobType: "full-time",
    status: "active",
  },
  {
    id: "2",
    title: "Product Marketing Manager",
    description:
      "Join our marketing team to drive product awareness and go-to-market strategies.",
    location: "Remote",
    department: "sales-gtm",
    jobType: "full-time",
    status: "active",
  },
  {
    id: "3",
    title: "Backend Engineer",
    description:
      "Build and maintain scalable backend services for our growing platform.",
    location: "Munich, Germany",
    department: "tech",
    jobType: "full-time",
    status: "paused",
  },
  {
    id: "4",
    title: "Operations Intern",
    description:
      "Great opportunity for students to gain hands-on experience in operations management.",
    location: "Hamburg, Germany",
    department: "operations",
    jobType: "internship",
    status: "draft",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    description:
      "Manage and improve our CI/CD pipelines and cloud infrastructure.",
    location: "Frankfurt, Germany",
    department: "tech",
    jobType: "full-time",
    status: "expired",
  },
  {
    id: "6",
    title: "Sales Development Representative",
    description:
      "Drive outbound sales efforts and qualify leads for the sales team.",
    location: "Remote",
    department: "sales-gtm",
    jobType: "full-time",
    status: "active",
  },
  {
    id: "7",
    title: "Working Student - HR",
    description:
      "Support the HR team with recruiting, onboarding, and employee engagement initiatives.",
    location: "Berlin, Germany",
    department: "operations",
    jobType: "part-time-working-student",
    status: "active",
  },
  {
    id: "8",
    title: "Data Analyst",
    description:
      "Analyze business data and provide insights to support decision-making.",
    location: "Cologne, Germany",
    department: "other",
    jobType: "full-time",
    status: "paused",
  },
  {
    id: "9",
    title: "UX Designer",
    description:
      "Design intuitive and beautiful user interfaces for our web and mobile applications.",
    location: "Remote",
    department: "tech",
    jobType: "full-time",
    status: "draft",
  },
  {
    id: "10",
    title: "Customer Success Manager",
    description:
      "Ensure customer satisfaction and drive retention through excellent support.",
    location: "Munich, Germany",
    department: "sales-gtm",
    jobType: "full-time",
    status: "expired",
  },
];

export default function TestPage() {
  const handleEdit = (id: string) => {
    console.log("Edit job:", id);
    alert(`Edit job with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Delete job:", id);
    alert(`Delete job with ID: ${id}`);
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-6 text-2xl font-bold">Job Listings Table Test</h1>
      <JobListingsTable
        data={sampleJobListings}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
