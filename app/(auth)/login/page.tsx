import { LoginForm } from "@/components/loginform";

export default function LoginPage() {
  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
