import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ArrowRight } from "lucide-react";
import React from "react";

const HeroSection = () => {
  return (
    <section className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col justify-between gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24">
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
          <h1 className="text-2xl font-bold text-balance sm:text-4xl lg:text-7xl">
            The Inner Circle
            <div className="italic font-['Times_New_Roman'] tracking-tight font-light">
              for startup hiring
            </div>
          </h1>
          <p className="text-muted-foreground">
            Connecting the best talent with the hottest startups.
            <br />
            Get your dream job in a high growth startup and make an impact.
          </p>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <a href="/signup/talent">
              Join now <ArrowRight />
            </a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#">Learn more</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
