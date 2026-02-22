"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, GraduationCap, FileText, Clock } from "lucide-react";
import type { TalentWithProfile } from "@/lib/types/talent";
import {
  getInitials,
  getCurrentStageLabel,
  getAvailabilityLabels,
  extractSkills,
} from "@/lib/types/talent";

interface TalentCardProps {
  talent: TalentWithProfile;
  onContact?: (talent: TalentWithProfile) => void;
}

export function TalentCard({ talent, onContact }: TalentCardProps) {
  const skills = extractSkills(talent.abilities);
  const availabilityLabels = getAvailabilityLabels(talent.availability);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Avatar and info */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{getInitials(talent.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              {/* Name and availability indicator */}
              <div className="flex items-center gap-2">
                <span className="font-medium">{talent.fullName}</span>
                {talent.profileStatus === "active" && (
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                )}
              </div>

              {/* Role */}
              <span className="text-sm text-muted-foreground">
                {talent.role}
              </span>

              {/* Location and Current Stage */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {talent.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{talent.location}</span>
                  </div>
                )}
                {talent.currentStage && (
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    <span>{getCurrentStageLabel(talent.currentStage)}</span>
                  </div>
                )}
              </div>

              {/* Availability badges */}
              {availabilityLabels.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {availabilityLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              )}

              {/* Skills/Abilities */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {skills.slice(0, 3).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-xs px-1.5 py-0"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {skills.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      +{skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col items-end gap-2">
            {talent.cvUrl && (
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <a
                  href={talent.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-3 w-3" />
                  CV
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onSelect={() => {
                onContact?.(talent);
              }}
            >
              <Mail className="h-3 w-3" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TalentListProps {
  talents: TalentWithProfile[];
  onContact?: (talent: TalentWithProfile) => void;
}

export function TalentList({ talents, onContact }: TalentListProps) {
  if (talents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">No talents found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {talents.map((talent) => (
        <TalentCard key={talent.userId} talent={talent} onContact={onContact} />
      ))}
    </div>
  );
}
