import { Calendar, FileText, Mail, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TalentReviewPage() {
  const applicationCycleEnd = new Date("2026-03-31T20:59:59Z");
  const reviewResponseDate = new Date("2026-04-15T23:59:59Z");
  const currentReviewStep =
    applicationCycleEnd > new Date()
      ? 1
      : reviewResponseDate > new Date()
        ? 2
        : 3;

  const reviewSteps = [
    {
      number: 1,
      icon: FileText,
      title: "Application Window",
      description: "Candidates submit applications during the open window",
    },
    {
      number: 2,
      icon: Users,
      title: "Batch Review",
      description:
        "We review all applications together after the window closes",
    },
    {
      number: 3,
      icon: Mail,
      title: "Decision Notification",
      description: "You'll receive an email with the outcome for your batch",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-lg shadow-lg p-8 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Application Received
            </h1>
            <p className="text-muted-foreground text-lg">
              We review applications in batches
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Current Application Cycle
                </h3>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Until</p>
                <p className="text-lg font-bold text-foreground">
                  {applicationCycleEnd.toLocaleDateString("en-GB", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Review Timeline
                </h3>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Response until</p>
                <p className="text-lg font-bold text-foreground">
                  {reviewResponseDate.toLocaleDateString("en-GB", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-muted pt-6 space-y-4">
            <h2 className="font-semibold text-foreground">
              Our Review Process
            </h2>
            <div className="space-y-1">
              {reviewSteps.map((step, index) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shrink-0 ${
                        currentReviewStep >= step.number
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </div>

                    {/* Draw the line connecting steps */}
                    {index < 2 && (
                      <div className="w-0.5 h-8 bg-muted mt-2"></div>
                    )}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="w-4 h-4 text-primary" />
                      <p className="font-medium text-foreground">
                        {step.title}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Thank you for applying!</span>{" "}
              We&apos;ll notify you by email once your batch review is complete.
            </p>
          </div>

          <div className="fixed top-8 left-8 flex items-center justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to start-circle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
