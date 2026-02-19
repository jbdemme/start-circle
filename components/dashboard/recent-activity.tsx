import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, FileText, Mail, CheckCircle } from "lucide-react";

export interface Activity {
  id: string;
  type: "application" | "job_posted" | "message" | "status_change";
  title: string;
  description: string;
  timestamp: Date;
  actor?: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "application",
    title: "New application received",
    description: "Sarah Chen applied for Senior ML Engineer",
    timestamp: new Date("2026-02-19T10:30:00"),
    actor: { name: "Sarah Chen" },
  },
  {
    id: "2",
    type: "message",
    title: "Message delivered",
    description: "Your message to Thomas Weber was read",
    timestamp: new Date("2026-02-19T09:15:00"),
  },
  {
    id: "3",
    type: "status_change",
    title: "Application status updated",
    description: "Marcus Johnson moved to Shortlisted",
    timestamp: new Date("2026-02-18T16:45:00"),
  },
  {
    id: "4",
    type: "job_posted",
    title: "Job listing published",
    description: "Founders Associate is now live",
    timestamp: new Date("2026-02-18T14:00:00"),
  },
  {
    id: "5",
    type: "application",
    title: "New application received",
    description: "Elena Rodriguez applied for GTM Intern",
    timestamp: new Date("2026-02-18T11:20:00"),
    actor: { name: "Elena Rodriguez" },
  },
];

const activityIcons: Record<Activity["type"], React.ReactNode> = {
  application: <UserPlus className="h-4 w-4 text-blue-500" />,
  job_posted: <FileText className="h-4 w-4 text-green-500" />,
  message: <Mail className="h-4 w-4 text-purple-500" />,
  status_change: <CheckCircle className="h-4 w-4 text-orange-500" />,
};

const activityBadgeStyles: Record<Activity["type"], string> = {
  application: "bg-blue-100 text-blue-800",
  job_posted: "bg-green-100 text-green-800",
  message: "bg-purple-100 text-purple-800",
  status_change: "bg-orange-100 text-orange-800",
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function RecentActivity({
  activities = defaultActivities,
}: RecentActivityProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from your hiring pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex gap-4 pl-10">
                {/* Timeline dot */}
                <div className="absolute left-2 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-border">
                  {activityIcons[activity.type]}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {activity.actor && (
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={activity.actor.avatar}
                            alt={activity.actor.name}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(activity.actor.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="font-medium text-sm">
                        {activity.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
