import { WaitlistForm } from "./waitlist-form";

export default function WaitlistPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-balance sm:text-4xl">
          Join the START Circle waitlist
        </h1>
        <p className="mt-3 text-muted-foreground">
          Share your email, pick your role, and we will reach out as soon as we
          open the next round.
        </p>
      </div>
      <WaitlistForm />
    </section>
  );
}
