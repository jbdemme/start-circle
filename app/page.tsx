import { ComponentExample } from "@/components/component-example";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";

export default function Page() {
  return (
    <div>
      <Header />

      <main className="flex flex-col">
        <HeroSection />
      </main>
      <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="w-160 h-160 bg-transparent border-2 border-cyan-400 rounded-full shadow-[0_0_300px_rgba(34,211,238,0.8)] animate-pulse"></div>
      </div>
    </div>
  );
}
