import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CURRENT_STAGE_LABELS, CurrentStageSchema } from "@/lib/schema";
import { Label } from "./ui/label";
import React, { startTransition, useActionState } from "react";
import { getPresignedUploadUrl } from "@/lib/cloudflare/r2";
import Link from "next/link";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Uploads a CV file to Cloudflare R2 storage using a presigned URL.
 * @param cvFile - The CV file to upload
 * @returns A promise resolving to an object with success status and fileKey or error
 */
async function uploadCvToR2(
  cvFile: File,
): Promise<
  { success: true; fileKey: string } | { success: false; error: string }
> {
  try {
    const fileKey = `${Date.now()}-${cvFile.name}`;
    const uploadUrl = await getPresignedUploadUrl(fileKey);

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/pdf",
      },
      body: cvFile,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload of CV with status ${uploadResponse.status}`);
    }

    return {
      success: true,
      fileKey: fileKey,
    };
  } catch (error) {
    console.error("CV Upload Error", error);
    return {
      success: false,
      error: (error as string) || "An error occurred during CV upload",
    };
  }
}

export default function TalentApplicationForm1() {
  const [state, formAction, pending] = useActionState(submitTalentApplication, {
    error: "",
  });
  const [cvError, setCvError] = React.useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setCvError("");

    const cvFile = formData.get("cvFile") as File;

    // check CV file
    if (cvFile.size === 0) {
      return setCvError("Please select a CV file to upload");
    } else if (cvFile.type !== "application/pdf") {
      return setCvError("Only PDF files are allowed");
    } else if (cvFile.size > MAX_FILE_SIZE) {
      return setCvError("File size exceeds 5MB limit");
    }

    // upload CV file
    const uploadResult = await uploadCvToR2(cvFile);

    if (!uploadResult.success) {
      setCvError("Failed to upload CV");
      return;
    }

    formData.set("cvFileKey", uploadResult.fileKey);
    formData.delete("cvFile");

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-2xl">
        <h3 className="text-balance text-2xl font-semibold text-foreground dark:text-foreground">
          Talent Application
        </h3>
        <p className="text-pretty mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
          Please fill out the application form below to apply as a talent.
        </p>
        <p className="text-destructive text-sm">{state.error || cvError}</p>
        <form action={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="full-name">
                  Full Name
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  id="full-name"
                  name="full-name"
                  autoComplete="full-name"
                  placeholder="Sam Altman"
                  required
                />
              </Field>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="experience-level">
                  Experience Level
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Select name="experienceLevel">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {CurrentStageSchema.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {CURRENT_STAGE_LABELS[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="col-span-full md:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="email">
                  Email
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="sam.altman@example.com"
                  required
                />
              </Field>
            </div>
            <div className="col-span-full md:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+43123456789"
                />
              </Field>
            </div>
            <div className="col-span-full">
              <Field className="gap-2">
                <FieldLabel htmlFor="city">Location</FieldLabel>
                <FieldContent className="gap-4">
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    autoComplete="address-level2"
                    placeholder="eg. Vienna"
                  />
                  <Field orientation="horizontal">
                    <Checkbox name="relocate" className="ml-2" />
                    <Label>willing to relocate</Label>
                  </Field>
                </FieldContent>
              </Field>
            </div>
            <div className="col-span-full">
              <Field className="gap-2">
                <FieldLabel htmlFor="linkedin-url">
                  LinkedIn URL
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  type="url"
                  id="linkedin-url"
                  name="linkedin-url"
                  autoComplete="url"
                  placeholder="https://www.linkedin.com/in/sam-altman"
                  required
                />
              </Field>
            </div>
            <div className="col-span-full">
              <Field className="gap-2">
                <FieldLabel htmlFor="phone">
                  CV
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  type="file"
                  id="cv_file"
                  name="cv_file"
                  accept="application/pdf"
                  required
                />
              </Field>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              className="whitespace-nowrap"
              asChild
            >
              <Link href="/">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="whitespace-nowrap"
              disabled={pending}
              variant={pending ? "outline" : "default"}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
