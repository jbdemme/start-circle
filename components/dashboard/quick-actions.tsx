import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Mail, FileText, Users, Calendar } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: "default" | "outline" | "secondary";
}

const quickActions: QuickAction[] = [
  {
    label: "Post a Job",
    description: "Create a new job listing",
    icon: <Plus className="h-4 w-4" />,
    href: "/dashboard/jobs",
    variant: "default",
  },
  {
    label: "Search Talent",
    description: "Find pre-vetted candidates",
    icon: <Search className="h-4 w-4" />,
    href: "#",
    variant: "outline",
  },
  {
    label: "Send Outreach",
    description: "Contact matched talent",
    icon: <Mail className="h-4 w-4" />,
    href: "#",
    variant: "outline",
  },
  {
    label: "Schedule Interview",
    description: "Set up candidate meetings",
    icon: <Calendar className="h-4 w-4" />,
    href: "#",
    variant: "outline",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks to manage your hiring pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto flex-col gap-2 py-4"
              asChild
            >
              <Link href={action.href}>
                {action.icon}
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
