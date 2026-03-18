import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BadgeCheck, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="h-full w-full flex flex-col items-center justify-center gap-12 overflow-x-hidden">
      {/* Hero Content */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 text-center sm:px-6 lg:px-8">
        {/* Main Message */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <Badge className="text-sm p-3" variant="secondary">
              <BadgeCheck data-icon="inline-start" />
              Pre-vetted
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-balance sm:text-4xl lg:text-7xl">
            The Inner Circle
            <div className="italic font-['Times_New_Roman'] tracking-tight font-light">
              for startup hiring
            </div>
          </h1>
          <div className="text-muted-foreground">
            Connecting the best talent with the hottest startups.
            <br />
            <div className="hidden md:inline">
              Get your dream job in a high growth startup and make an impact.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/waitlist">
              Join now <ArrowRight />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="/learn_more">Learn more</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
