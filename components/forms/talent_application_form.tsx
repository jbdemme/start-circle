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
import * as z from "zod";

// 5MB limit
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPE = "application/pdf";

const formSchema = z.object({
  full_name: z.string(),
  email: z.string().email("Invalid Email format"),
  linkedin_url: z.string().url("Invalid URL format"),
  location: z.string(),
  relocate: z.boolean(),
  upload_cv: z
    .instanceof(FileList) // Ensure it's the right object type
    .transform((list) => list[0]) // Convert FileList to a single File
    .refine((file) => file !== undefined, "File is required")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max 2MB")
    .refine((file) => ACCEPTED_TYPE.includes(file.type), "PDFs only"),
});

export default function TalentApplicationForm() {
  return (
    <form>
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
                  name="full_name"
                  autoComplete="name"
                  placeholder="Emma Crown"
                />
              </Field>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="phone-number">Email</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="mail@example.com"
                />
                <FieldDescription>
                  Startups can reach you under this email
                </FieldDescription>
              </Field>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field>
                <FieldLabel>LinkedIn URL</FieldLabel>
                <Input
                  type="text"
                  id="linkedin_url"
                  name="linkedin_url"
                  placeholder="https://www.linkedin.com/yourname"
                />
              </Field>
            </div>
            <div className="col-span-full">
              <FieldLabel htmlFor="location">Location</FieldLabel>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Input
                type="text"
                id="location"
                name="location"
                placeholder="Vienna"
              />
            </div>
            <div className="col-span-full sm:col-span-3 flex items-center">
              <Field orientation="horizontal">
                <Checkbox id="relocate" name="relocate" />
                <FieldLabel htmlFor="relocate">
                  I am open to relocate for the right opportunity
                </FieldLabel>
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
                  <FieldLabel htmlFor="cv-upload">Upload CV</FieldLabel>
                  <Input
                    type="file"
                    id="cv-upload"
                    name="cv-upload"
                    accept={ACCEPTED_TYPE}
                  />
                  <FieldDescription>Please upload a PDF</FieldDescription>
                </Field>
              </div>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2 w-full">
                <FieldLabel htmlFor="current_stage">Current stage</FieldLabel>
                <Select name="current_stage">
                  <SelectTrigger id="current_stage">
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
              </Field>
            </div>
            <div className="col-span-full">
              <Field>
                <FieldLabel htmlFor="specialization">Specialization</FieldLabel>
                <ToggleGroup
                  type="multiple"
                  variant="vibrant-outline"
                  spacing={2}
                  className="flex flex-wrap"
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
              </Field>
            </div>
            <div className="col-span-full">
              <Field className="gap-2">
                <FieldLabel htmlFor="workspace-description">
                  What do you want Startups to know about your profile?
                </FieldLabel>
                <Textarea placeholder="I am excellent in ..." />

                <FieldDescription>
                  Please do not just repeat your CV
                </FieldDescription>
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
                <Checkbox
                  id="team-requests"
                  name="team-requests"
                  defaultChecked
                />
                <FieldLabel htmlFor="team-requests" className="font-normal">
                  I confirm that I have read and accepted the Terms and
                  Conditions.
                  <span className="text-destructive">*</span>
                </FieldLabel>
              </div>
              <div className="flex items-center gap-x-3 py-1">
                <Checkbox
                  id="team-activity-digest"
                  name="team-activity-digest"
                />
                <FieldLabel
                  htmlFor="team-activity-digest"
                  className="font-normal"
                >
                  I have taken note of the privacy policy
                  <span className="text-destructive">*</span>
                </FieldLabel>
              </div>
              <div className="flex items-center gap-x-3 py-1">
                <Checkbox
                  id="team-activity-digest"
                  name="team-activity-digest"
                />
                <FieldLabel
                  htmlFor="team-activity-digest"
                  className="font-normal"
                >
                  I consent to my profile (name, CV/cover letter, email, phone
                  number) being displayed to registered partner companies for
                  the purpose of initiating an employment relationship, and I am
                  aware that partner companies can download and independently
                  process the data.
                  <span className="text-destructive">*</span>
                </FieldLabel>
              </div>
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
        >
          <Link href="/choose-role">Switch Role</Link>
        </Button>
        <Button type="submit" className="whitespace-nowrap">
          Send Application
        </Button>
      </div>
    </form>
  );
}
