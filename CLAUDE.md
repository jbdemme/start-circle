# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

START Circle is a platform by START Vienna for connecting talent with startups. Users go through an invite-code-gated signup, role selection, and application review before gaining full access.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm lint       # ESLint
```

There is no test suite configured.

## Tech Stack

- **Framework:** Next.js (App Router) with React 19 Server Components
- **Auth:** Clerk (`@clerk/nextjs`) — middleware in `proxy.ts` (not the default `middleware.ts`)
- **Database:** Supabase (PostgreSQL) via `@supabase/ssr`
- **UI:** shadcn/ui + Tailwind CSS v4
- **Forms:** React Hook Form + Zod validation
- **Client state:** TanStack React Query v5
- **File storage:** Cloudflare R2 via AWS S3 SDK

## Architecture

### Middleware (`proxy.ts`)
The Clerk middleware file is named `proxy.ts` (not the standard `middleware.ts`). It enforces an onboarding flow based on `sessionClaims.app_status` and `sessionClaims.app_role` stored in the Clerk JWT:

- `new` → must be at `/choose-role`
- `application` → must be at `/application/[role]`
- `in_review` → must be at `/review/[role]`
- `rejected` → must be at `/rejected/[role]`
- `accepted` → full access

The `/signup` route is gated by invite codes (currently hardcoded in `proxy.ts`).

### Route Groups
```
app/
  (marketing)/     # Public pages
  (onboarding)/    # Onboarding flow: choose-role → application/[role] → review/[role]
  dashboard/       # Protected: accepted users only
  test/            # Development/testing routes
```

### Data Layer
- **Server-side Supabase:** `lib/supabase/server.ts` — use for Server Components and Server Actions
- **Client-side Supabase:** `lib/supabase/client.ts` — use for Client Components
- **Data fetching functions:** `lib/data/` (e.g., `getMyProfile`, `getJobById`)
- **Server Actions:** `lib/actions.ts` — mutations using Supabase directly
- **React Query keys:** `lib/queries/keys.ts` — factory pattern for cache keys

### Schemas (`lib/schema/`)
Zod schemas define the shape of forms and data. Types are inferred from schemas. Key schemas: `talent.ts`, `job.ts`, `startup.ts`.

### File Uploads
CV uploads go to Cloudflare R2 via presigned URLs. See `lib/cloudflare/`.

## Auth Notes

- `lib/actions.ts` still contains legacy Supabase auth functions (`signUpNewUser`, `loginNewUser`) — these are **not used** in the Clerk migration and can be ignored.
- The active auth flow uses Clerk's hosted UI components and `@clerk/nextjs` server helpers.
- `app_status` and `app_role` are custom JWT claims set in Clerk and read via `sessionClaims` in the middleware.
