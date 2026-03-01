import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

const naviationItems = [
  { title: "Home", href: "/" },
  { title: "Getting Started", href: "/getting-started" },
  { title: "About us", href: "/about" },
];

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
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
          <Link href="#">
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
              {naviationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
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
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          {/* Show the user button when the user is signed in */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Header;
