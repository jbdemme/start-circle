import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Mail } from "lucide-react";
import Link from "next/link";

export interface Talent {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  skills: string[];
  matchScore: number;
  isAvailable: boolean;
}

interface TalentPoolPreviewProps {
  talents?: Talent[];
}

const defaultTalents: Talent[] = [
  {
    id: "1",
    name: "Alexandra Schmidt",
    role: "Full-Stack Developer",
    skills: ["React", "Node.js", "TypeScript"],
    matchScore: 95,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Thomas Weber",
    role: "ML Engineer",
    skills: ["Python", "TensorFlow", "AWS"],
    matchScore: 88,
    isAvailable: true,
  },
  {
    id: "3",
    name: "Julia Bauer",
    role: "Product Manager",
    skills: ["Strategy", "Agile", "Analytics"],
    matchScore: 82,
    isAvailable: false,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function TalentPoolPreview({
  talents = defaultTalents,
}: TalentPoolPreviewProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Talent Pool</CardTitle>
          <CardDescription>
            Pre-vetted candidates matching your needs
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="#" className="gap-1">
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={talent.avatar} alt={talent.name} />
                  <AvatarFallback>{getInitials(talent.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{talent.name}</span>
                    {talent.isAvailable && (
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {talent.role}
                  </span>
                  <div className="flex gap-1">
                    {talent.skills.slice(0, 2).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs px-1.5 py-0"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {talent.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        +{talent.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{talent.matchScore}%</span>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Mail className="h-3 w-3" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
