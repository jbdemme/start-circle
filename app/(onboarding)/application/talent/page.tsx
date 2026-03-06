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

export default function TalentApplicationPage() {
  return (
    <div className="flex justify-center items-center p-4 md:p-8">
      <TalentApplicationForm />
    </div>
  );
}

function TalentApplicationForm() {
  return (
    <form className="space-y-4 w-full">
      <h1 className="font-bold tex2xl md:text-4xl">Talent Application Form</h1>
      Full Name:
      <Input placeholder="Sam Altman" />
      Experience Level:
      <Select>
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
      <Input placeholder="eg. Vienna" />
      LinkedIn URL:
      <Input placeholder="https://linkedin.com/in/sam-altman" />
      Contact Email:
      <Input placeholder="contact@samaltman.com" />
      Phone Number (optional):
      <Input placeholder="+43 1 234 5678" />
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Submit Application</Button>
      </div>
    </form>
  );
}
