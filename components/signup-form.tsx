"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpNewUser } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useActionState } from "react";

interface SignupFormProps extends React.ComponentProps<typeof Card> {
  className?: string;
}

export function SignupForm({ className, ...props }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signUpNewUser, null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card {...props}>
        {/* Display Error Message */}
        {state?.error && (
          <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded">
            {state.error}
          </div>
        )}

        {/* Display Success Message */}
        {state?.success && (
          <div className="p-3 text-sm text-green-500 bg-green-100 border border-green-200 rounded">
            {state.success}
          </div>
        )}
        <CardHeader>
          <CardTitle>Create a talent account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mail@example.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={isPending}>
                    Create Account
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <a href="/login">Log in</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="text-center px-6">
        By clicking continue, you agree to START Circles{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
