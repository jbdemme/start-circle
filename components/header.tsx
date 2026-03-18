import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ApplicationStatus, Role } from "@/lib/schema";

import { cn } from "@/lib/utils";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const initialNaviationItems = [
  { title: "Home", href: "/" },
  { title: "Getting Started", href: "/learn_more" },
  { title: "About us", href: "/learn_more" },
];

function getNavigationItems(
  status: ApplicationStatus | undefined,
  role: Role | undefined,
) {
  const items = [...initialNaviationItems];

  if (!status || status === "new") {
    items[1] = { title: "Choose Role", href: "/choose-role" };
  } else if (status === "application") {
    items[1] = { title: "Finish application", href: `/application/${role}` };
  } else if (status === "in_review") {
    items[1] = { title: "Review screen", href: `/review/${role}` };
  } else if (status === "accepted") {
    items[1] = { title: "Dashboard", href: `/dashboard/${role}` };
  } else if (status === "rejected") {
    items[1] = { title: "Feedback", href: `/rejected/${role}` };
  }

  return items;
}

type HeaderProps = {
  className?: string;
};

export default async function Header({ className }: HeaderProps) {
  const { userId, sessionClaims } = await auth();
  let navigationItems;
  console.log("userId:", userId);
  if (!userId) {
    navigationItems = initialNaviationItems;
  } else {
    const status = sessionClaims?.app_status;
    const role = sessionClaims?.app_role;
    console.log("Session claims - status:", status, "role:", role);
    navigationItems = getNavigationItems(status, role);
  }

  return (
    <header
      className={cn(
        "bg-[rgba(19,19,26,0.64)] sticky top-0 z-50 h-16 border-b",
        className,
      )}
    >
      <div className="mx-auto flex justify-between items-center h-full max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex-1 flex justify-start">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl">
              <span className="text-primary font-bold ">START</span>{" "}
              <span className="font-light">Circle</span>
            </h1>
          </Link>
        </div>

        {/* Middle */}
        <div className="hidden md:flex flex-1 justify-center">
          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={`${item.href}-${item.title}`}>
                  <NavigationMenuLink
                    className="w-32 truncate justify-center"
                    title={item.title}
                    href={item.href}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end gap-2">
          {/* <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut> */}
          {/* Show the user button when the user is signed in */}
          {/* <SignedIn>
            <UserButton />
          </SignedIn> */}
        </div>
      </div>
    </header>
  );
}
