"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  CalendarArrowDown,
  CalendarArrowUp,
  Edit,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  type Department,
  type JobType,
  type JobStatus,
  DEPARTMENT_LABELS,
  JOB_TYPE_LABELS,
  JOB_STATUS_LABELS,
} from "@/lib/types/job";

// Type for the jobs table display
// Uses unified types from lib/types/job.ts
export type Job = {
  id: string;
  title: string;
  department: Department;
  jobType: JobType;
  location: string;
  status: JobStatus;
  posted: Date;
};

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: "Job Title",
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue("department") as Department;
      return DEPARTMENT_LABELS[department] || department;
    },
  },
  {
    accessorKey: "jobType",
    header: "Job Type",
    cell: ({ row }) => {
      const jobType = row.getValue("jobType") as JobType;
      return JOB_TYPE_LABELS[jobType] || jobType;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as JobStatus;
      const variantMap: Record<
        JobStatus,
        "secondary" | "default" | "outline" | "destructive"
      > = {
        draft: "secondary",
        active: "default",
        paused: "outline",
        expired: "destructive",
      };
      return (
        <Badge variant={variantMap[status]}>{JOB_STATUS_LABELS[status]}</Badge>
      );
    },
  },
  {
    accessorKey: "posted",
    header: ({ column }) => {
      const currentSortDirection = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(currentSortDirection === "asc")}
        >
          Date
          {currentSortDirection === "asc" ? (
            <CalendarArrowUp />
          ) : (
            <CalendarArrowDown />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const posted = new Date(row.getValue("posted"));
      const seconds = Math.floor((Date.now() - posted.getTime()) / 1000);

      if (seconds >= 2592000)
        return `${Math.floor(seconds / 2592000)} months ago`;
      if (seconds >= 86400) return `${Math.floor(seconds / 86400)} days ago`;

      return "today";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => remove(job.id)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function remove(id: string) {}
