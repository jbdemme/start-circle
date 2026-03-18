import { Code2, Mail } from "lucide-react";
import Link from "next/link";

export default function AuthError() {
  return (
    <div className="h-full w-full flex  flex-col justify-center items-center text-center p-4 md:p-10">
      <h1 className="text-3xl md:text-4xl">Auth Error</h1>
      <br />
      <p>
        Seems like there was an error with our the authentication of your
        account.
      </p>
      <p>
        You can try again with the{" "}
        <span className="font-bold">verification link</span> you should have
        received in you email.
      </p>
      <br />
      <div>
        Please report the issue to us via <br />
        <div className="flex gap-2">
          <Link
            href="mailto:circle@start-vienna.com"
            className="font-bold underline flex gap-1"
          >
            <Mail /> Email
          </Link>{" "}
          or directly create an issue on{" "}
          <Link
            href="https://github.com/jbdemme/start-circle"
            className="font-bold underline flex gap-1"
          >
            <Code2 />
            Github
          </Link>
        </div>
      </div>
    </div>
  );
}
