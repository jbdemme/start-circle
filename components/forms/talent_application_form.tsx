"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SPECIALITY_LABELS, SpecialitySchema } from "@/lib/types/general";
import { ScrollArea } from "../ui/scroll-area";
import { PRIVACY_POLICY } from "@/constants/policy";
import { CURRENT_STAGE_LABELS, CurrentStageSchema } from "@/lib/types/talent";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import Link from "next/link";
import {
  talentApplicationSchema,
  type TalentApplicationFormData,
} from "@/lib/schema";
import { getPresignedUrl } from "@/app/(onboarding)/application/talent/_actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// 5MB limit
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPE = "application/pdf";

interface TalentApplicationFormProps {
  onSubmit?: (
    formData: TalentApplicationFormData,
    cvKey: string,
  ) => Promise<{ success: boolean; error?: string; applicationId?: string }>;
}

export default function TalentApplicationForm({
  onSubmit,
}: TalentApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TalentApplicationFormData>({
    resolver: zodResolver(talentApplicationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      linkedin_url: "",
      location: "",
      relocate: false,
      current_stage: undefined,
      specializations: [],
      description: "",
      accept_terms: false,
      accept_privacy: false,
      accept_data_sharing: false,
    },
  });

  const onFormSubmit = async (data: Record<string, unknown>): Promise<void> => {
    if (!onSubmit) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Get the file input element
      const fileInput = document.querySelector(
        'input[name="upload_cv"]',
      ) as HTMLInputElement;
      if (!fileInput?.files?.[0]) {
        setSubmitError("Please upload a CV file");
        return;
      }

      const file = fileInput.files[0];

      // Validate file
      if (file.size > MAX_FILE_SIZE) {
        setSubmitError("File size exceeds 5MB limit");
        return;
      }

      if (file.type !== ACCEPTED_TYPE) {
        setSubmitError("Only PDF files are accepted");
        return;
      }

      try {
        // Upload file to R2 using presigned URL
        setUploadingFile(true);
        const { signedUrl, key } = await getPresignedUrl(file.name, file.type);

        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
          credentials: "omit", // Ensure no cookies are sent with this request
        });

        if (!uploadResponse.ok) {
          setSubmitError("Failed to upload CV. Please try again.");
          return;
        }

        // Success - file successfully uploaded
        setUploadingFile(false);

        // Submit form data to server action
        const result = await onSubmit(data as TalentApplicationFormData, key);

        if (!result.success) {
          setSubmitError(result.error || "Failed to submit application");
        } else {
          // Success - form was successfully submitted
          toast.success("Application submitted successfully!");
          await user?.reload();
          router.push("/review/talent");
        }
      } catch (uploadError) {
        setSubmitError("Failed to upload CV file");
        console.error("Upload error:", uploadError);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred",
      );
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      setUploadingFile(false);
    }
  };

  const getFieldError = (fieldName: keyof TalentApplicationFormData) => {
    return errors[fieldName]?.message;
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {submitError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-balance font-semibold text-foreground dark:text-foreground">
            Personal information
          </h2>
          <p className="text-pretty mt-1 text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
            General personal information about yourself.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full">
              <Field className="gap-2">
                <FieldLabel htmlFor="full_name">Full name</FieldLabel>
                <Input
                  type="text"
                  id="full_name"
                  {...register("full_name")}
                  placeholder="Emma Crown"
                  aria-invalid={!!errors.full_name}
                />
                {getFieldError("full_name") && (
                  <p className="text-sm text-destructive">
                    {getFieldError("full_name")}
                  </p>
                )}
              </Field>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="mail@example.com"
                  aria-invalid={!!errors.email}
                />
                <FieldDescription>
                  Startups can reach you under this email
                </FieldDescription>
                {getFieldError("email") && (
                  <p className="text-sm text-destructive">
                    {getFieldError("email")}
                  </p>
                )}
              </Field>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="linkedin_url">LinkedIn URL</FieldLabel>
                <Input
                  type="text"
                  id="linkedin_url"
                  {...register("linkedin_url")}
                  placeholder="https://www.linkedin.com/yourname"
                  aria-invalid={!!errors.linkedin_url}
                />
                {getFieldError("linkedin_url") && (
                  <p className="text-sm text-destructive">
                    {getFieldError("linkedin_url")}
                  </p>
                )}
              </Field>
            </div>
            <div className="col-span-full">
              <FieldLabel htmlFor="location">Location</FieldLabel>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Input
                type="text"
                id="location"
                {...register("location")}
                placeholder="Vienna"
                aria-invalid={!!errors.location}
              />
              {getFieldError("location") && (
                <p className="text-sm text-destructive">
                  {getFieldError("location")}
                </p>
              )}
            </div>
            <div className="col-span-full sm:col-span-3 flex items-center">
              <Field orientation="horizontal">
                <Controller
                  name="relocate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="relocate"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel htmlFor="relocate" className="font-normal">
                        I am open to relocate for the right opportunity
                      </FieldLabel>
                    </>
                  )}
                />
              </Field>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-balance font-semibold text-foreground dark:text-foreground">
            Professional profile
          </h2>
          <p className="text-pretty mt-1 text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
            Your unique skillset and profile that makes you on of the best.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor="upload_cv">Upload CV</FieldLabel>
                  <Input
                    type="file"
                    id="upload_cv"
                    name="upload_cv"
                    accept={ACCEPTED_TYPE}
                    disabled={uploadingFile}
                  />
                  <FieldDescription>Please upload a PDF</FieldDescription>
                </Field>
              </div>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2 w-full">
                <FieldLabel htmlFor="current_stage">Current stage</FieldLabel>
                <Controller
                  name="current_stage"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="current_stage"
                        aria-invalid={!!errors.current_stage}
                      >
                        <SelectValue placeholder="Select your stage..." />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {CurrentStageSchema.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {CURRENT_STAGE_LABELS[option]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {getFieldError("current_stage") && (
                  <p className="text-sm text-destructive">
                    {getFieldError("current_stage")}
                  </p>
                )}
              </Field>
            </div>
            <div className="col-span-full">
              <Field>
                <FieldLabel htmlFor="specializations">
                  Specializations
                </FieldLabel>
                <Controller
                  name="specializations"
                  control={control}
                  render={({ field }) => (
                    <ToggleGroup
                      type="multiple"
                      variant="vibrant-outline"
                      spacing={2}
                      className="flex flex-wrap"
                      value={field.value || []}
                      onValueChange={field.onChange}
                    >
                      {SpecialitySchema.options.map((option) => (
                        <ToggleGroupItem
                          key={option}
                          value={option}
                          className="data-[state=off]:text-muted-foreground"
                        >
                          {SPECIALITY_LABELS[option]}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  )}
                />
              </Field>
            </div>
            <div className="col-span-full">
              <Field className="gap-2">
                <FieldLabel htmlFor="profile_description">
                  What do you want Startups to know about your profile?
                </FieldLabel>
                <Textarea
                  id="profile_description"
                  {...register("description")}
                  placeholder="I am excellent in ..."
                />
                <FieldDescription>
                  Please do not just repeat your CV
                </FieldDescription>
                {getFieldError("description") && (
                  <p className="text-sm text-destructive">
                    {getFieldError("description")}
                  </p>
                )}
              </Field>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-balance font-semibold text-foreground dark:text-foreground">
            Privacy Policy
          </h2>
          <p className="text-pretty mt-1 text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
            Privacy Policy and other legal content.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <fieldset>
            <legend className="text-sm font-medium text-foreground dark:text-foreground">
              Privacy Policy and Terms and Conditions
            </legend>
            <FieldDescription className="mt-1 leading-6">
              Please read and accept.
            </FieldDescription>
            <div className="mt-2 text-muted-foreground">
              <div className="flex items-center gap-x-3 py-1">
                <Controller
                  name="accept_terms"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="accept_terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel
                        htmlFor="accept_terms"
                        className="font-normal"
                      >
                        I confirm that I have read and accepted the Terms and
                        Conditions.
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                    </>
                  )}
                />
              </div>
              {getFieldError("accept_terms") && (
                <p className="text-sm text-destructive ml-6">
                  {getFieldError("accept_terms")}
                </p>
              )}
              <div className="flex items-center gap-x-3 py-1">
                <Controller
                  name="accept_privacy"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="accept_privacy"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel
                        htmlFor="accept_privacy"
                        className="font-normal"
                      >
                        I have taken note of the privacy policy
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                    </>
                  )}
                />
              </div>
              {getFieldError("accept_privacy") && (
                <p className="text-sm text-destructive ml-6">
                  {getFieldError("accept_privacy")}
                </p>
              )}
              <div className="flex items-center gap-x-3 py-1">
                <Controller
                  name="accept_data_sharing"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="accept_data_sharing"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel
                        htmlFor="accept_data_sharing"
                        className="font-normal"
                      >
                        I consent to my profile (name, CV/cover letter, email,
                        phone number) being displayed to registered partner
                        companies for the purpose of initiating an employment
                        relationship, and I am aware that partner companies can
                        download and independently process the data.
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                    </>
                  )}
                />
              </div>
              {getFieldError("accept_data_sharing") && (
                <p className="text-sm text-destructive ml-6">
                  {getFieldError("accept_data_sharing")}
                </p>
              )}
            </div>
          </fieldset>
          <ScrollArea className="w-full border rounded-md h-60 p-4 mt-2">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground">
              {PRIVACY_POLICY}
            </div>
          </ScrollArea>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          className="whitespace-nowrap"
          asChild
          disabled={isSubmitting || uploadingFile}
        >
          <Link href="/choose-role">Switch Role</Link>
        </Button>
        <Button
          type="submit"
          className="whitespace-nowrap"
          disabled={isSubmitting || uploadingFile}
        >
          {uploadingFile
            ? "Uploading CV..."
            : isSubmitting
              ? "Submitting..."
              : "Send Application"}
        </Button>
      </div>
    </form>
  );
}
