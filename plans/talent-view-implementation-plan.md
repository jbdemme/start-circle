# Talent View Implementation Plan

## Overview

This plan outlines the implementation of the talent view in START Circle, including:

1. Restructuring existing routes under `/startup` prefix
2. Creating new routes under `/talent` prefix
3. Implementing JWT Custom Claims for secure role-based routing
4. Creating a talent-specific sidebar

## Architecture Diagram

```mermaid
graph TB
    subgraph Authentication
        A[User Login] --> B{JWT with Role Claim}
        B -->|startup| C[Startup Routes]
        B -->|talent| D[Talent Routes]
    end

    subgraph Startup Routes
        C --> C1[/startup/dashboard]
        C --> C2[/startup/jobs]
        C --> C3[/startup/talent]
        C --> C4[/startup/settings]
    end

    subgraph Talent Routes
        D --> D1[/talent/dashboard]
        D --> D2[/talent/jobs]
        D --> D3[/talent/startups]
        D --> D4[/talent/settings]
    end
```

## Route Structure

### Current Structure

```
app/dashboard/
├── (fullscreen)/
│   └── jobs/
│       ├── new/page.tsx
│       └── [id]/edit/page.tsx
└── (sidebar)/
    ├── layout.tsx
    ├── page.tsx
    ├── jobs/page.tsx
    └── talent/page.tsx
```

### New Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/
│       ├── page.tsx
│       └── talent/page.tsx
├── startup/
│   ├── (fullscreen)/
│   │   └── jobs/
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   └── (sidebar)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── jobs/page.tsx
│       └── talent/page.tsx
└── talent/
    └── (sidebar)/
        ├── layout.tsx
        ├── page.tsx          # Placeholder
        ├── jobs/page.tsx     # Placeholder
        ├── startups/page.tsx # Placeholder
        └── settings/page.tsx # Placeholder
```

## Implementation Steps

### Phase 1: JWT Custom Claims Setup

#### Step 1.1: Create Database Migration

Create a Supabase migration to add role to JWT claims:

```sql
-- Migration: Add role to JWT claims
-- File: supabase/migrations/YYYYMMDD_add_role_to_jwt.sql

-- Add role column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'talent';

-- Create function to add role to JWT
CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  RETURN jsonb_build_object(
    'role', COALESCE(user_role, 'talent')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update JWT on profile change
CREATE OR REPLACE FUNCTION handle_user_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Force JWT refresh by updating updated_at
  UPDATE auth.users SET updated_at = NOW() WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_role_change
AFTER UPDATE OF role ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_user_role_change();
```

#### Step 1.2: Create Utility Function

Create [`lib/auth/role.ts`](lib/auth/role.ts):

```typescript
import { createClient } from "@/lib/supabase/server";

export type UserRole = "startup" | "talent";

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Role is now in the JWT claims
  const role = user.app_metadata?.role as UserRole | undefined;

  return role || "talent"; // Default to talent
}
```

### Phase 2: Restructure Startup Routes

#### Step 2.1: Move Dashboard Routes

Move all files from `app/dashboard/` to `app/startup/`:

| Old Path                                             | New Path                                           |
| ---------------------------------------------------- | -------------------------------------------------- |
| `app/dashboard/(fullscreen)/jobs/new/page.tsx`       | `app/startup/(fullscreen)/jobs/new/page.tsx`       |
| `app/dashboard/(fullscreen)/jobs/[id]/edit/page.tsx` | `app/startup/(fullscreen)/jobs/[id]/edit/page.tsx` |
| `app/dashboard/(sidebar)/layout.tsx`                 | `app/startup/(sidebar)/layout.tsx`                 |
| `app/dashboard/(sidebar)/page.tsx`                   | `app/startup/(sidebar)/page.tsx`                   |
| `app/dashboard/(sidebar)/jobs/page.tsx`              | `app/startup/(sidebar)/jobs/page.tsx`              |
| `app/dashboard/(sidebar)/talent/page.tsx`            | `app/startup/(sidebar)/talent/page.tsx`            |

#### Step 2.2: Update Startup Sidebar

Update [`components/startup-sidebar.tsx`](components/startup-sidebar.tsx) (renamed from app-sidebar.tsx):

```typescript
const data = {
  navMain: [
    {
      title: "Jobs",
      url: "#",
      icon: <Briefcase />,
      items: [
        { title: "Overview", url: "/startup/dashboard" },
        { title: "Job Postings", url: "/startup/jobs" },
        { title: "Applications", url: "#" },
        { title: "Drafts", url: "#" },
      ],
    },
    {
      title: "Talent",
      url: "#",
      icon: <Users />,
      items: [
        { title: "Talent Pool", url: "/startup/talent" },
        { title: "Saved Talent", url: "#" },
        { title: "Outreach History", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        { title: "Company Profile", url: "#" },
        { title: "Team", url: "#" },
        { title: "Other", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "mailto:circle@start-vienna.com?subject=START+Circle+Feedback", icon: Send },
  ],
};
```

### Phase 3: Create Talent Routes

#### Step 3.1: Create Talent Sidebar Component

Create [`components/talent-sidebar.tsx`](components/talent-sidebar.tsx):

```typescript
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
  Building2,
  LifeBuoy,
  Send,
} from "lucide-react";
import { NavSecondary } from "./nav-secondary";

const data = {
  navMain: [
    {
      title: "Jobs",
      url: "/talent/jobs",
      icon: <Briefcase />,
      isActive: true,
    },
    {
      title: "Startups",
      url: "/talent/startups",
      icon: <Building2 />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        { title: "Profile", url: "/talent/settings" },
        { title: "Account", url: "#" },
        { title: "Notifications", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "mailto:circle@start-vienna.com?subject=START+Circle+Feedback", icon: Send },
  ],
};

export function TalentSidebar({ profile }: { profile: Profile }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/talent/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <House />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-medium">
                    <span className="font-bold">START</span>{" "}
                    <span className="font-light">Circle</span>
                  </span>
                  <span className="truncate text-xs">Talent Dashboard</span>
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
```

#### Step 3.2: Create Talent Layout

Create [`app/talent/(sidebar)/layout.tsx`](<app/talent/(sidebar)/layout.tsx>):

```typescript
import { TalentSidebar } from "@/components/talent-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getMyProfile } from "@/lib/data/user";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getMyProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <TalentSidebar profile={profile} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
```

#### Step 3.3: Create Placeholder Pages

Create empty placeholder pages for talent routes:

- [`app/talent/(sidebar)/page.tsx`](<app/talent/(sidebar)/page.tsx>) - Talent dashboard
- [`app/talent/(sidebar)/jobs/page.tsx`](<app/talent/(sidebar)/jobs/page.tsx>) - Browse jobs
- [`app/talent/(sidebar)/startups/page.tsx`](<app/talent/(sidebar)/startups/page.tsx>) - Browse startups
- [`app/talent/(sidebar)/settings/page.tsx`](<app/talent/(sidebar)/settings/page.tsx>) - Settings

### Phase 4: Update Existing Proxy for Role-Based Routing

Update the existing [`lib/supabase/proxy.ts`](lib/supabase/proxy.ts) to handle role-based redirects:

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  // Redirect unauthenticated users to login
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based routing for authenticated users
  if (user) {
    const role = user.app_metadata?.role || "talent";

    // Redirect old /dashboard routes to appropriate new routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = request.nextUrl.pathname.replace("/dashboard", `/${role}`);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
```

Update [`proxy.ts`](proxy.ts) config matcher:

```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match all dashboard, startup, and talent routes
    "/dashboard/:path*",
    "/startup/:path*",
    "/talent/:path*",
  ],
};
```

### Phase 5: Update Internal Links

Update all internal links throughout the application:

| Component                                                                | Changes                                   |
| ------------------------------------------------------------------------ | ----------------------------------------- |
| [`components/startup-sidebar.tsx`](components/startup-sidebar.tsx)       | Update all URLs to use `/startup/` prefix |
| [`components/talent-sidebar.tsx`](components/talent-sidebar.tsx)         | Use `/talent/` prefix                     |
| [`app/startup/(sidebar)/layout.tsx`](<app/startup/(sidebar)/layout.tsx>) | Update home link                          |
| Dashboard components                                                     | Update any hardcoded `/dashboard` links   |

## Files to Create

1. `supabase/migrations/YYYYMMDD_add_role_to_jwt.sql` - Database migration
2. `lib/auth/role.ts` - Role utility function
3. `components/startup-sidebar.tsx` - Renamed and updated sidebar
4. `components/talent-sidebar.tsx` - New talent sidebar
5. `app/startup/` - All moved dashboard files
6. `app/talent/(sidebar)/layout.tsx` - Talent layout
7. `app/talent/(sidebar)/page.tsx` - Talent dashboard placeholder
8. `app/talent/(sidebar)/jobs/page.tsx` - Jobs placeholder
9. `app/talent/(sidebar)/startups/page.tsx` - Startups placeholder
10. `app/talent/(sidebar)/settings/page.tsx` - Settings placeholder

## Files to Delete

1. `app/dashboard/` - Entire directory (after moving to startup)
2. `components/app-sidebar.tsx` - Renamed to startup-sidebar.tsx

## Files to Update

1. `lib/supabase/proxy.ts` - Add role-based redirect logic
2. `proxy.ts` - Update matcher config for new routes
3. `lib/data/user.ts` - Add role to profile type if needed
4. Any components with hardcoded `/dashboard` links

## Notes

- The JWT Custom Claims approach requires running the migration in Supabase
- Existing users will need their role set in the profiles table
- The proxy handles backward compatibility by redirecting old `/dashboard` routes
- Placeholder pages for talent routes will be implemented in a future task
