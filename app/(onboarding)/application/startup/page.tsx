"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { startTransition, useActionState } from "react";
import { submitStartupApplication } from "./action";

export default function StartupApplicationPage() {
  return (
    <div className="flex justify-center items-center p-4 md:p-8">
      <StartupApplicationForm />
    </div>
  );
}

function StartupApplicationForm() {
  const [state, formAction, pending] = useActionState(
    submitStartupApplication,
    {
      error: "",
    },
  );

  const handleSubmit = async (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4 w-full max-w-xl">
      <h1 className="font-bold text2xl md:text-4xl">
        Startup Application Form
      </h1>
      <p className="text-destructive">{state.error}</p>
      Startup name:
      <Input placeholder="Perplexity AI" name="startupName" />
      Website:
      <Input placeholder="https://www.perplexity.ai" name="website" />
      Description:
      <Textarea
        placeholder="Tell us about your startup..."
        name="description"
      />
      <div className="flex justify-end gap-4">
        <Button variant="outline"> Cancel </Button>
        <Button type="submit">Submit Application</Button>
      </div>
    </form>
  );
}
