"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser, Profile } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Settings2Icon,
  House,
  Briefcase,
  Users,
  LifeBuoy,
  Send,
} from "lucide-react";
import { NavSecondary } from "./nav-secondary";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Jobs",
      url: "#",
      icon: <Briefcase />,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Job Postings",
          url: "/dashboard/jobs",
        },
        {
          title: "Applications",
          url: "#",
        },
        {
          title: "Drafts",
          url: "#",
        },
      ],
    },
    {
      title: "Talent",
      url: "#",
      icon: <Users />,
      items: [
        {
          title: "Talent Pool",
          url: "#",
        },
        {
          title: "Saved Talent",
          url: "#",
        },
        {
          title: "Outreach History",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "Company Profile",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Other",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "mailto:circle@start-vienna.com?subject=START+Circle+Feedback",
      icon: Send,
    },
  ],
};

export function AppSidebar({ profile }: { profile: Profile }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <House />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-medium">
                    <span className="font-bold">START</span>{" "}
                    <span className="font-light">Circle</span>
                  </span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser profile={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
