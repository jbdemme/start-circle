import { Button } from "@/components/ui/button";
import { CircleUser, Mail } from "lucide-react";
import { Linkedin } from "./ui/svgs/linkedin";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "mailto:circle@start-vienna.com", label: "Contact" },
  { href: "/legal_notice", label: "Legal Notice" },
  { href: "/privacy_policy", label: "Privacy Policy" },
];

const socialLinks = [
  {
    href: "#",
    label: "LinkedIn",
    icon: <Linkedin />,
  },
  {
    href: "mailto:circle@start-vienna.com",
    label: "E-Mail",
    icon: <Mail />,
  },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl *:px-4 *:py-4 *:md:px-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">START</span>{" "}
            <span className="font-light">Circle</span>
          </div>
          <nav className="hidden sm:block">
            <ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a className="hover:text-foreground" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center">
            {socialLinks.map(({ href, label, icon }) => (
              <Button asChild key={label} size="icon-sm" variant="ghost">
                <a aria-label={label} href={href}>
                  {icon}
                </a>
              </Button>
            ))}
          </div>
        </div>
        <nav className="block sm:hidden">
          <ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a className="hover:text-foreground" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center justify-between gap-4 border-t text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} START Circle</p>

        <p className="inline-flex items-center gap-1">
          <span>Built by</span>
          <a
            aria-label="linkedIn"
            className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground hover:underline"
            href={"https://www.linkedin.com/in/jonathan-demme-757285212/"}
            rel="noreferrer"
            target="_blank"
          >
            <CircleUser size={16} />
            Jonathan
          </a>
        </p>
      </div>
    </footer>
  );
}
