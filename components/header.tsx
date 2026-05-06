import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import Link from "next/link";

const initialNaviationItems = [
  { title: "Home", href: "/" },
  { title: "Getting Started", href: "/learn_more" },
  { title: "About us", href: "/learn_more" },
];

type HeaderProps = {
  className?: string;
};

export default async function Header({ className }: HeaderProps) {

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
              {initialNaviationItems.map((item) => (
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
        </div>
      </div>
    </header>
  );
}
