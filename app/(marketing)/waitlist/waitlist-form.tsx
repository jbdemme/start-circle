"use client";

import { useActionState, useState } from "react";
import { joinWaitlist } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

const roleOptions = [
  { value: "talent", label: "Talent" },
  { value: "startup", label: "Startup" },
] as const;

type RoleOption = (typeof roleOptions)[number]["value"] | "";

export function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(joinWaitlist, null);
  const [role, setRole] = useState<RoleOption>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join the waitlist</CardTitle>
        <CardDescription>
          Get early access updates and a heads up when your role opens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.error && (
          <div className="mb-4 rounded-md border border-red-200 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {state?.success ? (
          <div className="rounded-md border border-green-700 p-4 text-sm bg-green-700/10">
            {state.success}
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel>I&apos;m joining as ...</FieldLabel>
                <ToggleGroup
                  type="single"
                  spacing={2}
                  variant="outline"
                  value={role}
                  onValueChange={(value) => setRole(value as RoleOption)}
                  className="flex flex-wrap"
                >
                  {roleOptions.map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      className="data-[state=off]:text-muted-foreground"
                    >
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Referred by (optional)</FieldLabel>
                <Input
                  name="referrer"
                  type="text"
                  placeholder="Sam Altman"
                />
              </Field>
            </FieldGroup>

            <input type="hidden" name="role" value={role} />

            <Button type="submit" size="lg" disabled={isPending}>
              Join waitlist
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
