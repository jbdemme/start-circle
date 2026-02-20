"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newJobSchema } from "@/lib/schema";
import {
  DEPARTMENT_LABELS,
  JOB_TYPE_LABELS,
  type JobFormData,
} from "@/lib/types/job";
import { createJob } from "@/lib/actions";
import { toast } from "sonner";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface NewJobFormProps {
  startupId: string;
}

export function NewJobForm({ startupId }: NewJobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormData>({
    resolver: zodResolver(newJobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      department: undefined,
      jobType: undefined,
    },
    mode: "onBlur",
  });

  async function onSubmit(data: JobFormData) {
    setIsSubmitting(true);

    const result = await createJob(startupId, data);

    if (result.success) {
      toast.success("Job created successfully");
      router.back();
    } else {
      toast.error(result.error || "Failed to create job");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-balance font-semibold text-foreground dark:text-foreground">
            General Information
          </h2>
          <p className="text-pretty mt-1 text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
            General information about the job listed.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="job-title">Job Title</FieldLabel>
                    <Input
                      {...field}
                      id="job-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Founders Associate"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input
                      {...field}
                      id="location"
                      aria-invalid={fieldState.invalid}
                      placeholder="eg. Vienna, Munich, Remote"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <Controller
                name="jobType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="job-type">Job type</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      name="jobType"
                    >
                      <SelectTrigger id="job-type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {Object.entries(JOB_TYPE_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <Controller
                name="department"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="department">Department</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      name="department"
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {Object.entries(DEPARTMENT_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-balance font-semibold text-foreground dark:text-foreground">
            Job Description
          </h2>
          <p className="text-pretty mt-1 text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
            Brief description about the job. This could include who you are
            looking for and why your startup and why this position.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full">
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="job-description">
                      Job Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="job-description"
                      rows={4}
                      className="sm:min-h-60"
                    />
                    <FieldDescription>
                      Note: shorter is better. Nobody cares about your fruit
                      basket.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          className="whitespace-nowrap"
          onSelect={() => router.back()}
        >
          Go back
        </Button>
        <Button
          type="submit"
          className="whitespace-nowrap"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save as draft"}
        </Button>
      </div>
    </form>
  );
}
