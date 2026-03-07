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
import { useActionState } from "react";

export default function TalentApplicationPage() {
  return (
    <div className="flex justify-center items-center p-4 md:p-8">
      <TalentApplicationForm />
    </div>
  );
}

function TalentApplicationForm() {
  const [state, formAction, pending] = useActionState(submitTalentApplication, {
    message: "",
  });

  return (
    <form action={formAction} className="space-y-4 w-full">
      <p className="text-muted-foreground">{state.message}</p>
      <h1 className="font-bold text2xl md:text-4xl">Talent Application Form</h1>
      {state.errors?.upload && (
        <div className="text-destructive">{state.errors.upload[0]}</div>
      )}
      Full Name:
      <Input placeholder="Sam Altman" name="fullName" />
      {state.errors?.full_name && (
        <p className="text-destructive">{state.errors.full_name[0]}</p>
      )}
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
      {state.errors?.current_stage && (
        <p className="text-destructive">{state.errors.current_stage[0]}</p>
      )}
      Location:
      <Input placeholder="eg. Vienna" name="location" />
      LinkedIn URL:
      <Input
        placeholder="https://linkedin.com/in/sam-altman"
        name="linkedinUrl"
      />
      {state.errors?.linkedin_url && (
        <p className="text-destructive">{state.errors.linkedin_url[0]}</p>
      )}
      Contact Email:
      <Input placeholder="contact@samaltman.com" name="email" />
      {state.errors?.email && (
        <p className="text-destructive">{state.errors.email[0]}</p>
      )}
      Phone Number (optional):
      <Input placeholder="+43 1 234 5678" name="phoneNumber" />
      {state.errors?.phone_number && (
        <p className="text-destructive">{state.errors.phone_number[0]}</p>
      )}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button type="submit" disabled={pending}>
          Submit Application
        </Button>
      </div>
    </form>
  );
}
