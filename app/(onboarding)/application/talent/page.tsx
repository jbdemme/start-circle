import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPECIALITY_LABELS, SpecialitySchema } from "@/lib/schema";
import { submitTalentApplication } from "./action";

export default function TalentApplicationPage() {
  return (
    <div className="flex justify-center items-center p-4 md:p-8">
      <TalentApplicationForm />
    </div>
  );
}

function TalentApplicationForm() {
  return (
    <form action={submitTalentApplication} className="space-y-4 w-full">
      <h1 className="font-bold tex2xl md:text-4xl">Talent Application Form</h1>
      Full Name:
      <Input placeholder="Sam Altman" name="fullName" />
      Experience Level:
      <Select name="experienceLevel">
        <SelectTrigger>
          <SelectValue placeholder="Select your experience level" />
        </SelectTrigger>
        <SelectContent position="popper">
          {SpecialitySchema.options.map((option) => (
            <SelectItem key={option} value={option}>
              {SPECIALITY_LABELS[option]}
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
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Submit Application</Button>
      </div>
    </form>
  );
}
