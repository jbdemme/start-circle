import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";

export default function InReviewPage() {
  return (
    <div className="flex  flex-col justify-center items-center p-10 pb-0 h-screen text-center">
      <div className="max-w-md border rounded-lg p-8 bg-muted/95 shadow-lg shadow-primary/50">
        <h1 className="text-2xl font-bold">Thank you for your application!</h1>
        <p className="text-muted-foreground mt-2">
          We really appreciate your interest in joining START Circle and getting
          in contact with the best talent.
        </p>
        <p className="text-muted-foreground mt-2">
          Your application is currently under review. We will notify you via
          email in the coming days about the following procedure of your
          application.
        </p>
        <p className="text-muted-foreground mt-2">
          If you have any questions, please contact us at{" "}
          <a
            href="mailto:circle@start-vienna.com?subject=START%20Circle%20Application%20Inquiry"
            className="text-primary underline"
          >
            {" "}
            circle@start-vienna.com
          </a>
          .
        </p>
      </div>
      <Link href="/" className="mt-8">
        <Home className="inline mr-2" />
        Back to home
      </Link>
    </div>
  );
}
