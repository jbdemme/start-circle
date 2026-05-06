import HeroSection from "@/components/hero-section";

export default function HomePage() {
  return (
    <>
      <main className="h-full w-full flex flex-col mb-80">
        <HeroSection />
      </main>
      <div className="hidden absolute inset-x-0 h-dvh -z-10 md:flex items-center justify-center md:top-5 -top-20">
        <div className="w-[75vmin] md:w-[90vmin] h-[75vmin] md:h-[90vmin] bg-transparent border-2 border-primary rounded-full shadow-[0_0_300px_rgba(149,175,207,0.8)] animate-pulse"></div>
      </div>
    </>
  );
}
