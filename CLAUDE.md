# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

START Circle is a platform by START Vienna for connecting talent with startups. Users go through an invite-code-gated signup, role selection, and application review before gaining full access.

Key features:
- **Auth:** Invite-code-gated signup with role selection (talent / startup)
- **CV upload:** Talents upload their CV (stored in Cloudflare R2)
- **Talent profiles:** Stored in Neon and visible to startups
- **Job listings:** Startups create jobs (title, description, apply link); talents can browse them

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm lint       # ESLint
```

There is no test suite configured.

## Tech Stack

- **Framework:** Next.js (App Router) with React 19 Server Components
- **Auth:** better-auth — session stored in Neon, middleware in `middleware.ts`
- **Database:** Neon (PostgreSQL) via `@neondatabase/serverless`
- **ORM:** Drizzle ORM (`drizzle-orm` + `drizzle-kit`)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Forms:** React Hook Form + Zod validation
- **Client state:** TanStack React Query v5
- **File storage:** Cloudflare R2 via AWS S3 SDK (presigned URLs for CV uploads)

## Architecture

### Middleware (`middleware.ts`)
better-auth session middleware enforces the onboarding flow based on `user.app_status` and `user.app_role` columns in the database:

- `new` → must be at `/choose-role`
- `application` → must be at `/application/[role]`
- `in_review` → must be at `/review/[role]`
- `rejected` → must be at `/rejected/[role]`
- `accepted` → full access

The `/signup` route is gated by invite codes (hardcoded in `middleware.ts`).

### Route Groups
```
app/
  (marketing)/     # Public pages
  (onboarding)/    # Onboarding flow: choose-role → application/[role] → review/[role]
  dashboard/       # Protected: accepted users only
```

### Data Layer
- **DB client:** `lib/db/index.ts` — Neon + Drizzle client (use in Server Components and Server Actions)
- **Schema:** `lib/db/schema.ts` — Drizzle table definitions (users, talent_profiles, jobs)
- **Data fetching functions:** `lib/data/` (e.g., `getMyProfile`, `getJobById`)
- **Server Actions:** `lib/actions.ts` — mutations using Drizzle directly
- **React Query keys:** `lib/queries/keys.ts` — factory pattern for cache keys

### DB Schema (key tables)
- `users` — managed by better-auth; extended with `app_status`, `app_role` columns
- `talent_profiles` — CV URL, bio, skills, linked to `users`
- `jobs` — title, description, apply_link, created by startup users

### Schemas (`lib/schema/`)
Zod schemas define the shape of forms and data. Types are inferred from schemas. Key schemas: `talent.ts`, `job.ts`, `startup.ts`.

### Auth (`lib/auth/`)
- `lib/auth/index.ts` — better-auth server instance
- `lib/auth/client.ts` — better-auth client for use in Client Components
- Session is read via `auth.api.getSession()` in Server Components / Server Actions

### File Uploads
CV uploads go to Cloudflare R2 via presigned URLs. See `lib/cloudflare/`.
