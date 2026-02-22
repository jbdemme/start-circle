"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, MoreHorizontal, Pause, Rocket, Trash2 } from "lucide-react";
import {
  type JobListing,
  type JobStatus,
  JOB_STATUS_LABELS,
  getDepartmentLabel,
  getJobTypeLabel,
  getJobStatusLabel,
} from "@/lib/types/job";

// Re-export types for backward compatibility
export type { JobListing, JobStatus } from "@/lib/types/job";
export type { Department, JobType } from "@/lib/types/job";

interface JobListingsTableProps {
  data: JobListing[];
  onPublish?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPause?: (id: string) => void;
}

// Status badge variant mapping
const statusVariants: Record<
  JobStatus,
  "secondary" | "default" | "outline" | "destructive"
> = {
  draft: "secondary",
  active: "default",
  paused: "outline",
  expired: "destructive",
};

export function JobListingsTable({
  data,
  onPublish,
  onEdit,
  onDelete,
  onPause,
}: JobListingsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter data based on status
  const filteredData =
    statusFilter === "all"
      ? data
      : data.filter((job) => job.status === statusFilter);

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by status:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All</SelectItem>
            {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{getDepartmentLabel(job.department)}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{getJobTypeLabel(job.jobType)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[job.status]}>
                      {getJobStatusLabel(job.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {job.status !== "active" && (
                          <DropdownMenuItem
                            onSelect={() => {
                              onPublish?.(job.id);
                            }}
                          >
                            <Rocket className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {job.status === "active" && (
                          <DropdownMenuItem
                            onSelect={() => {
                              onPause?.(job.id);
                            }}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => onEdit?.(job.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => onDelete?.(job.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No job listings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
