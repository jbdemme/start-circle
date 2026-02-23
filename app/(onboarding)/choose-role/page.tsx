"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setRole } from "./_actions";
import { toast } from "sonner";

export default function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await setRole(formData);
    if (res?.message) {
      // Forces a token refresh and refreshes the `User` object
      toast.success(`${res.message.role} role selected!`);
      await user?.reload();
      router.push("/");
    }
    if (res?.error) {
      toast.error(res.error);
    }
  };
  return (
    <div className="flex flex-col min-h-dvh justify-center items-center gap-10 md:gap-20">
      <h1 className="text-muted-foreground text-3xl md:text-6xl">I am a ...</h1>
      <form action={handleSubmit} className="flex gap-6 md:gap-15">
        <Button
          name="role"
          variant="outline"
          className="h-40 w-40 text-2xl hover:scale-130"
          value="talent"
        >
          Talent
        </Button>
        <Button
          name="role"
          variant="outline"
          className="h-40 w-40 text-2xl hover:scale-130"
          value="startup"
        >
          Startup
        </Button>
      </form>
    </div>
  );
}
