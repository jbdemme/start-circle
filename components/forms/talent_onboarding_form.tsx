import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function TalentOnboardingForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Talent Onboarding</CardTitle>
        <CardDescription>
          Complete your talent profile to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="role">
                Application Type <span className="text-destructive">*</span>
              </FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your application type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="talent">Talent</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {
              <Field>
                <FieldLabel htmlFor="cv">
                  Upload CV <span className="text-destructive">*</span>
                </FieldLabel>
                <Input id="cv" type="file" name="cv" required accept=".pdf" />
                <FieldDescription>
                  Upload your CV in PDF format
                </FieldDescription>
              </Field>
            }
          </FieldGroup>
          <div>
            <label>Application Type</label>
            <p>Enter your type of application</p>
            <input type="text" name="role" required />
          </div>
          {/* {error && <p className="text-red-600">Error: {error}</p>} */}
          <button type="submit">Submit</button>
        </form>
      </CardContent>
    </Card>
  );
}
