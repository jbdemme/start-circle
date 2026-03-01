import HeroSection from "@/components/hero-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "START Circle",
  description: "Find the best talent for your startup",
};

export default function HomePage() {
  return (
    <>
      <main className="flex flex-col">
        <HeroSection />
      </main>
      <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="w-[90vmin] h-[90vmin] bg-transparent border-2 border-cyan-400 rounded-full shadow-[0_0_300px_rgba(34,211,238,0.8)] animate-pulse"></div>
      </div>
      <div className="fixed bottom-4 right-4 z-10 text-xs text-muted-foreground">
        <a href="/legal_notice">Legal Notice</a> |{" "}
        <a href="/privacy_policy">Privacy Policy</a>
      </div>
    </>
  );
}
