import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Users,
  Shield,
  Check,
  ArrowRight,
  Zap,
  AlertCircle,
  Clock,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

function ErrorCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-card/50 border border-red-500/20">
      <CardHeader>
        <div className="flex items-center gap-4">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground">{description}</CardContent>
    </Card>
  );
}

export default function LearnMorePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white selection:bg-zinc-800">
      {/* Problem Section */}
      <section className="w-full py-24 from-black to-zinc-950 border-b border-zinc-900">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/20">
              The Problem
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Hiring is broken
            </h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Traditional platforms are flooded with noise, slow, and give you
              no real signal on who is actually great.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ErrorCard
              title="Noise"
              description="Over 90% of applicants are unqualified, leading to wasted time and missed opportunities."
              icon={<AlertCircle className="w-8 h-8 text-red-500/80" />}
            />
            <ErrorCard
              title="Slow & Tedious"
              description="Outbound sourcing yields low response rates and months of back and forth."
              icon={<Clock className="w-8 h-8 text-red-500/80" />}
            />
            <ErrorCard
              title="No Signal"
              description="A resume tells you almost nothing about capability or cultural fit."
              icon={<EyeOff className="w-8 h-8 text-red-500/80" />}
            />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="w-full py-24 bg-zinc-950">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              The Solution
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              <span className="font-bold text-primary">START</span>{" "}
              <span className="font-light">Circle</span>
            </h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
              An invite-only network where quality, trust, and velocity reign.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-zinc-900 border-primary/20 hover:border-primary/40 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-primary/5 rounded-full blur-2xl" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground">
                    Vetted Talent
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-zinc-400 relative z-10">
                Exclusive, peer-vouched network with zero spam. Every member
                verified by top operators and founders.
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-primary/20 hover:border-primary/40 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    Fast & Direct
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-zinc-400 relative z-10">
                Engage directly with tier-one talent ready to move immediately.
                No months-long sourcing cycles.
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-primary/20 hover:border-primary/40 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    High Quality Signal
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-zinc-400 relative z-10">
                Peer reputation proves capability and drive before the first
                interview.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-24 md:py-32 bg-black">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              How it works
            </h2>
            <p className="text-zinc-400 md:text-lg">
              An ecosystem built on trust, quality, and velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    1. Invite-Only Network
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-zinc-400">
                We restrict access to maintain exceptional quality. Talent and
                startups must receive a referral from our top members to apply.
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    2. Vetted by Peers
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-zinc-400">
                Every candidate is vetted by our team to ensure they meet our
                high standards. Only the best talent gets in.
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    3. Ready to Hire
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-zinc-400">
                Engage directly with top talent who have signaled their
                excellence and are read to join a top tier startup
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-24 bg-gradient-to-br from-zinc-900 via-black to-black border-t border-zinc-800">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Ready to hire your next key operator?
          </h2>
          <p className="text-zinc-400 md:text-xl mb-10 max-w-2xl mx-auto">
            Stop competing for attention in crowded inboxes. Join START Circle
            and get direct access to Europe&apos;s most ambitious talent
            network.
          </p>
          <Link href="/application/startup">
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-medium rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              Request Startup Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
