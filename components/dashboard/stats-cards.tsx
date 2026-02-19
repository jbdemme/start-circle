import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Briefcase, Mail, UserCheck } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-sm font-medium">
          {title}
        </CardDescription>
        <div className="text-muted-foreground h-4 w-4">{icon}</div>
      </CardHeader>
      <div className="px-6 pb-4">
        <CardTitle className="text-2xl font-bold">{value}</CardTitle>
        <p className="text-muted-foreground text-xs">
          {trend && (
            <span
              className={trend.isPositive ? "text-green-600" : "text-red-600"}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%{" "}
            </span>
          )}
          {description}
        </p>
      </div>
    </Card>
  );
}

interface StatsCardsProps {
  stats?: {
    totalApplications: number;
    activeJobs: number;
    talentMatches: number;
    messagesSent: number;
  };
}

const defaultStats = {
  totalApplications: 47,
  activeJobs: 3,
  talentMatches: 12,
  messagesSent: 28,
};

export function StatsCards({ stats = defaultStats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      description: "from last month",
      icon: <Users className="h-4 w-4" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Active Job Listings",
      value: stats.activeJobs,
      description: "currently accepting applications",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      title: "Talent Matches",
      value: stats.talentMatches,
      description: "new matches this week",
      icon: <UserCheck className="h-4 w-4" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Messages Sent",
      value: stats.messagesSent,
      description: "to pre-vetted talent",
      icon: <Mail className="h-4 w-4" />,
      trend: { value: 3, isPositive: false },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
