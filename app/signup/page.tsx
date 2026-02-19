import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUpNewUserr } from "@/lib/actions";

export default function SingUpPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-sm ">
      <form action={signUpNewUserr} className="space-y-4 ">
        <FieldGroup className="gap-4">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          {/* Full Name */}
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input id="fullName" name="fullName" placeholder="John Doe" />
          </Field>
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
            />
          </Field>
          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" />
          </Field>
          {/* Role Selection */}
          <Field>
            <FieldLabel htmlFor="role">I am a...</FieldLabel>
            <Select name="role">
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="talent">Talent</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <FieldGroup>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account? <a href="/login">Log in</a>
            </FieldDescription>
          </FieldGroup>
        </FieldGroup>
      </form>
    </div>
  );
}
