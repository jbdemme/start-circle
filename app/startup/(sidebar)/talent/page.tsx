"use client";

import { useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Funnel, Loader2, Users, Search } from "lucide-react";
import { TalentList } from "@/components/talent-list";
import { useTalents } from "@/hooks/use-talents";
import type { TalentWithProfile } from "@/lib/types/talent";
import {
  CURRENT_STAGE_LABELS,
  AVAILABILITY_TYPE_LABELS,
  type AvailabilityType,
} from "@/lib/types/talent";
import { toast } from "sonner";

export default function TalentPoolPage() {
  const { data: talents, isLoading, error } = useTalents();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchQuery = searchParams.get("query") ?? "";
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    AvailabilityType | "all"
  >("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  // Handle search - update URL params
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  // Extract unique locations for filter
  const uniqueLocations = useMemo(() => {
    if (!talents) return [];
    const locations = talents
      .map((t) => t.location)
      .filter((loc): loc is string => loc !== null);
    return [...new Set(locations)].sort();
  }, [talents]);

  // Filter talents based on search and filters
  const filteredTalents = useMemo(() => {
    if (!talents) return [];

    return talents.filter((talent) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        talent.fullName.toLowerCase().includes(searchLower) ||
        talent.role.toLowerCase().includes(searchLower) ||
        (talent.location?.toLowerCase().includes(searchLower) ?? false);

      // Current stage filter
      const matchesStage =
        stageFilter === "all" || talent.currentStage === stageFilter;

      // Availability filter (check if talent's availability includes the selected type)
      const matchesAvailability =
        availabilityFilter === "all" ||
        (talent.availability?.includes(availabilityFilter) ?? false);

      // Location filter
      const matchesLocation =
        locationFilter === "all" || talent.location === locationFilter;

      return (
        matchesSearch && matchesStage && matchesAvailability && matchesLocation
      );
    });
  }, [talents, searchQuery, stageFilter, availabilityFilter, locationFilter]);

  const handleContact = (talent: TalentWithProfile) => {
    if (talent.email) {
      window.location.href = `mailto:${talent.email}`;
    } else {
      toast.error("No email available for this talent");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Talent Pool</CardTitle>
            <CardDescription>
              Browse and connect with pre-vetted candidates.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Loading talents...
            </span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Talent Pool</CardTitle>
            <CardDescription>
              Browse and connect with pre-vetted candidates.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-destructive">Failed to load talents</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-2xl font-bold">Talent Pool</CardTitle>
            <CardDescription>
              Browse and connect with pre-vetted candidates.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {filteredTalents.length} of {talents?.length ?? 0} talents
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <InputGroup className="grow">
              <InputGroupInput
                placeholder="Search by name, role, or location..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchQuery}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <div className="flex gap-4">
              {/* Filter (Popover) */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Funnel />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end">
                  <PopoverHeader>
                    <PopoverTitle>Filter</PopoverTitle>
                    <PopoverDescription>
                      Narrow down your talent search
                    </PopoverDescription>
                  </PopoverHeader>
                  <FieldGroup className="gap-4">
                    <Field orientation="horizontal">
                      <FieldLabel>Stage</FieldLabel>
                      <Select
                        value={stageFilter}
                        onValueChange={setStageFilter}
                      >
                        <SelectTrigger className="w-full max-w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {Object.entries(CURRENT_STAGE_LABELS).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel>Availability</FieldLabel>
                      <Select
                        value={availabilityFilter}
                        onValueChange={(value) =>
                          setAvailabilityFilter(
                            value as AvailabilityType | "all",
                          )
                        }
                      >
                        <SelectTrigger className="w-full max-w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {Object.entries(AVAILABILITY_TYPE_LABELS).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel>Location</FieldLabel>
                      <Select
                        value={locationFilter}
                        onValueChange={setLocationFilter}
                      >
                        <SelectTrigger className="w-full max-w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {uniqueLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </PopoverContent>
              </Popover>

              {/* Sorting Select */}
              <Field orientation="horizontal" className="flex-1">
                <FieldLabel className="text-nowrap">Sort by:</FieldLabel>
                <Select defaultValue="name">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Talent List */}
      <TalentList talents={filteredTalents} onContact={handleContact} />
    </div>
  );
}
