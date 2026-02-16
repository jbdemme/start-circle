import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import Link from "next/link";

export type NavigationSection = {
  title: string;
  href: string;
};

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

const Header = ({ navigationData, className }: HeaderProps) => {
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
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="w-26 truncate justify-center"
                  title="Home"
                  href="/"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="w-38 truncate justify-center">
                  Getting Started
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-64">
                    <ListItem href="/talent" title="Talent">
                      Join the inner circle as a talent
                    </ListItem>
                    <ListItem href="/startup" title="Startup">
                      Get access to the best prevetted talent
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="w-26 truncate justify-center"
                  title="About us"
                  href="#"
                >
                  About us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end gap-2">
          <Button variant="ghost" className="rounded-lg max-md:hidden" asChild>
            <a href="#">For Startups</a>
          </Button>
          <Button
            variant="outline"
            className="rounded-lg max-md:hidden"
            asChild
          >
            <a href="#">Log In</a>
          </Button>
          <Button className="rounded-lg max-md:hidden" asChild>
            <a href="/signup/talent">Sign Up</a>
          </Button>
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
