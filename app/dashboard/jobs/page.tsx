import SearchInput from "@/components/search-input";
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
import { Funnel, Plus } from "lucide-react";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = searchParams?.page || 1;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-2xl font-bold">Job Postings</CardTitle>
            <CardDescription>
              Manage your active listings and track incoming applications.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Listing
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <SearchInput />
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
                      Narrow down your job listings
                    </PopoverDescription>
                  </PopoverHeader>
                  <FieldGroup className="gap-4">
                    <Field orientation="horizontal">
                      <FieldLabel>Status</FieldLabel>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full max-w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel>Department</FieldLabel>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full max-w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">General</SelectItem>
                          <SelectItem value="paused">Tech</SelectItem>
                          <SelectItem value="expired">GTM</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </PopoverContent>
              </Popover>

              {/* Sorting Select */}
              <Field orientation="horizontal" className="flex-1">
                <FieldLabel className="text-nowrap">Sort by:</FieldLabel>
                <Select defaultValue="new">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Newest</SelectItem>
                    <SelectItem value="old">Oldest</SelectItem>
                    <SelectItem value="applications">Applications</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div>Hello these are the job listings fitting to the search.</div>
        </CardContent>
      </Card>
    </div>
  );
}
