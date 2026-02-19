// import { LoginForm } from "@/components/loginform";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default function LoginPage() {
//   return (
//     <>
//       <div className="min-h-svh flex flex-col p-6 md:p-10">
//         <Link href="/">
//           <ArrowLeft />
//         </Link>
//         <div className="flex-1 flex justify-center items-center">
//           <div className="w-full max-w-sm">
//             <LoginForm />
//           </div>
//         </div>
//       </div>

//     </>
//   );
// }

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logInAction } from "@/lib/actions";

export default function SingUpPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Log In</h1>

      <form action={logInAction} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>

        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>
    </div>
  );
}
