"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobFormSchema, type JobFormData, JOB_TYPE_LABELS } from "@/lib/schema/job";
import { SPECIALITY_LABELS } from "@/lib/schema/general";
import { createJob } from "@/lib/actions";
import { toast } from "sonner";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface JobFormProps {
  startupId: string;
}

export function JobForm({ startupId }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      department: null,
      job_type: null,
    },
    mode: "onBlur",
  });

  async function onSubmit(data: JobFormData) {
    setIsSubmitting(true);

    const result = await createJob(startupId, data);

    if (result.success) {
      toast.success("Job saved as draft");
      router.push("/startup/jobs");
    } else {
      toast.error(result.error || "Failed to create job");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">General Information</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Basic details about this position.
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
                      placeholder="Vienna, Munich, Remote…"
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
                name="job_type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="job-type">Job Type</FieldLabel>
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                      name="job_type"
                    >
                      <SelectTrigger id="job-type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
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
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                      name="department"
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {Object.entries(SPECIALITY_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
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
          <h2 className="font-semibold text-foreground">Job Description</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Who you're looking for and why this role exists.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor="job-description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="job-description"
                  rows={6}
                  className="sm:min-h-48"
                />
                <FieldDescription>Keep it concise and honest.</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save as draft"}
        </Button>
      </div>
    </form>
  );
}
