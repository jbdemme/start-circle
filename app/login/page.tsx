import { LoginForm } from "@/components/loginform";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="min-h-svh flex flex-col p-6 md:p-10">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <div className="flex-1 flex justify-center items-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
