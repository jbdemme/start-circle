import HeroSection from "@/components/hero-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "START Circle",
  description: "Find the best talent for your startup",
};

export default function HomePage() {
  return (
    <>
      <main className="h-full w-full flex flex-col mb-80">
        <HeroSection />
      </main>
      <div className="absolute top-0 inset-x-0 h-dvh -z-10 flex items-center justify-center">
        <div className="w-[90vmin] h-[90vmin] bg-transparent border-2 border-cyan-400 rounded-full shadow-[0_0_300px_rgba(34,211,238,0.8)] animate-pulse"></div>
      </div>
    </>
  );
}
