"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
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

// Sidebar data for startup users
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
          url: "/startup",
        },
        {
          title: "Job Postings",
          url: "/startup/jobs",
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
          url: "/startup/talent",
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

export function StartupSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/startup/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <House />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-medium">
                    <span className="font-bold">START</span>{" "}
                    <span className="font-light">Circle</span>
                  </span>
                  <span className="truncate text-xs">Startup Dashboard</span>
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
