import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function StartupApplicationPage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4 md:p-8">
      <Card className="max-w-2xl w-full border-muted/50 p-4 md:p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight md:text-4xl">
            Application Received
          </CardTitle>
          <CardDescription className="text-xl text-foreground/80 max-w-lg mx-auto">
            Thank you for applying to join{" "}
            <span className="text-primary font-bold">START</span>{" "}
            <span className="font-light">Circle</span>!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Highlighted Callout Box */}
          <div className="bg-muted/30 p-6 rounded-xl border border-muted/50 flex flex-col sm:flex-row gap-5 items-start text-left">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0 sm:mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">
                Commitment to Quality
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                To guarantee our talent sees only top-tier startups with
                exceptional job offers, we carefully vet every startup and
                talent. This maintains our platform's core foundation:
                connecting <span className="font-bold">excellent talent</span>{" "}
                with <span className="font-bold">excellent startups</span>.
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Review Timeline</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  We process applications as fast as possible, typically within{" "}
                  <strong>3 business days</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Decision</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Once our team has made a decision, we will notify you via
                  email.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-col items-center px-6 sm:px-12 space-y-4 text-center">
          <p className="text-sm text-muted-foreground max-w-md">
            We appreciate your patience. While you wait, feel free to explore
            our platform and learn more about what we offer.
          </p>
          <Button
            asChild
            size="lg"
            className="gap-2 w-full sm:w-auto h-12 px-8"
          >
            <Link href="/">
              Explore START Circle <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
