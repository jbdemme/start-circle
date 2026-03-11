"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENT_STAGE_LABELS, CurrentStageSchema } from "@/lib/schema";
import { submitTalentApplication } from "./action";
import React, { startTransition, useActionState } from "react";
import { getPresignedUploadUrl } from "@/lib/cloudflare/r2";
import { Spinner } from "@/components/ui/spinner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function TalentApplicationPage() {
  return (
    <div className="flex justify-center items-center p-4 md:p-8">
      <TalentApplicationForm />
    </div>
  );
}

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

function TalentApplicationForm() {
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
    <form action={handleSubmit} className="space-y-4 w-full">
      <h1 className="font-bold text2xl md:text-4xl">Talent Application Form</h1>
      <p className="text-destructive text-sm">{state.error || cvError}</p>
      Full Name:
      <Input placeholder="Sam Altman" name="fullName" />
      Experience Level:
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
      Location:
      <Input placeholder="eg. Vienna" name="location" />
      LinkedIn URL:
      <Input
        placeholder="https://linkedin.com/in/sam-altman"
        name="linkedinUrl"
      />
      Contact Email:
      <Input placeholder="contact@samaltman.com" name="email" />
      Phone Number (optional):
      <Input placeholder="+43 1 234 5678" name="phoneNumber" />
      CV upload:
      <Input type="file" name="cvFile" accept="application/pdf" />
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button
          type="submit"
          disabled={pending}
          variant={pending ? "outline" : "default"}
        >
          {pending && <Spinner data-icon="inline-start" />}
          Submit Application
        </Button>
      </div>
    </form>
  );
}
