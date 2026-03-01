"use client";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export default function StartupOnboardingForm() {
  return (
    <div className="sm:mx-auto sm:max-w-2xl">
      <h3 className="text-2xl font-semibold text-foreground">
        Startup Application
      </h3>
      <p className="text-pretty mt-1 text-sm text-muted-foreground">
        Complete your startup profile to get started. Everything can be changed
        later.
      </p>
      <form action="#" className="mt-8">
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
          <div className="col-span-full">
            <Field className="gap-2">
              <FieldLabel htmlFor="company-name">
                Company Name
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="text"
                id="company-name"
                name="company-name"
                autoComplete="company-name"
                placeholder="e.g. Perplexity"
                required
              />
            </Field>
          </div>
          <div className="col-span-full">
            <Field className="gap-2">
              <FieldLabel htmlFor="company-name">
                Description
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="company-name"
                name="company-name"
                autoComplete="company-name"
                placeholder="Who are you and what do you do?"
                required
              />
            </Field>
          </div>
          <div className="col-span-full">
            <Field className="gap-2">
              <FieldLabel htmlFor="address">
                Company Page <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="text"
                id="address"
                name="address"
                autoComplete="street-address"
                placeholder="https://www.perplexity.ai"
                required
              />
            </Field>
          </div>
          <div className="col-span-full md:col-span-3">
            <Field className="gap-2">
              <FieldLabel htmlFor="email">Application Email</FieldLabel>
              <Input
                type="text"
                id="email"
                name="email"
                placeholder="people@perplexity.ai"
              />
            </Field>
          </div>
          <div className="col-span-full md:col-span-3">
            <CheckboxGroup data={checkboxData} />
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" className="whitespace-nowrap">
            Cancel
          </Button>
          <Button type="submit" className="whitespace-nowrap">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

const checkboxData: CheckboxData = {
  legend: "Email Preferences",
  description: "Select the emails you would like to receive.",
  items: [
    {
      id: "email-updates",
      label: "Platform updates and new features",
      defaultChecked: true,
    },
    {
      id: "email-job-inquiries",
      label: "Job posting inquiries from candidates",
      defaultChecked: true,
    },
    {
      id: "email-newsletter",
      label: "Hiring tips and industry newsletter",
      defaultChecked: false,
    },
  ],
};

type CheckboxData = {
  legend: string;
  description: string;
  items: {
    id: string;
    label: string;
    defaultChecked?: boolean;
  }[];
};

export function CheckboxGroup({ data }: { data: CheckboxData }) {
  return (
    <FieldSet>
      <FieldLegend variant="label">{data.legend}</FieldLegend>
      <FieldDescription>{data.description}</FieldDescription>
      <FieldGroup className="gap-3">
        {/* Map through the items in the data and render a checkbox for each item */}
        {data.items.map((item) => (
          <Field orientation="horizontal" key={item.id}>
            <Checkbox
              id={item.id}
              name={item.id}
              defaultChecked={item.defaultChecked}
            />
            <FieldLabel htmlFor={item.id} className="font-normal">
              {item.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}
