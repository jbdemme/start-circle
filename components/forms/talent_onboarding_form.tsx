import { SPECIALITY_LABELS, SpecialitySchema } from "@/lib/types/general";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Check } from "lucide-react";

export default function TalentOnboardingForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Talent Application</CardTitle>
        <CardDescription>
          Complete your talent profile to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="full-name">
                Full Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="text"
                id="full-name"
                name="full-name"
                autoComplete="name"
                placeholder="e.g. John Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="specialization">
                Specialization <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldDescription>Select all that apply</FieldDescription>
              <ToggleGroup
                type="multiple"
                variant="vibrant-outline"
                spacing={2}
                className="flex flex-wrap"
              >
                {SpecialitySchema.options.map((option) => (
                  <ToggleGroupItem key={option} value={option}>
                    {SPECIALITY_LABELS[option]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="cv">
                Upload CV <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="cv" type="file" name="cv" required accept=".pdf" />
              <FieldDescription>Upload your CV in PDF format</FieldDescription>
            </Field>
          </FieldGroup>
          {/* {error && <p className="text-red-600">Error: {error}</p>} */}
          <button type="submit">Submit</button>
        </form>
      </CardContent>
    </Card>
  );
}
