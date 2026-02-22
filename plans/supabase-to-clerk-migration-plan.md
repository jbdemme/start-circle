# Supabase Auth to Clerk Migration Plan

## Overview

This plan outlines the migration from Supabase Auth to Clerk while keeping Supabase PostgreSQL as the database. The migration will use Clerk's `public_metadata` for storing user role and status.

## Current State Analysis

### Authentication Flow

- **Client**: [`lib/supabase/client.ts`](lib/supabase/client.ts) - Browser client using `@supabase/ssr`
- **Server**: [`lib/supabase/server.ts`](lib/supabase/server.ts) - Server client with cookie handling
- **Middleware**: [`lib/supabase/proxy.ts`](lib/supabase/proxy.ts) - Session management and role-based routing

### User Roles and Status

- **Roles**: `startup` | `talent`
- **Status**: `in_review` | `accepted` | `rejected`
- Currently stored in Supabase `app_metadata` and synced to JWT claims

### Auth-related Files to Modify

| File                                | Current Purpose       | Action                        |
| ----------------------------------- | --------------------- | ----------------------------- |
| `lib/supabase/client.ts`            | Browser auth client   | Remove auth, keep for DB      |
| `lib/supabase/server.ts`            | Server auth client    | Remove auth, keep for DB      |
| `lib/supabase/proxy.ts`             | Middleware for auth   | Replace with Clerk middleware |
| `lib/auth/role.ts`                  | Role/status helpers   | Rewrite for Clerk             |
| `lib/actions.ts`                    | Auth server actions   | Update for Clerk              |
| `lib/data/user.ts`                  | User profile fetching | Update to use Clerk user ID   |
| `app/login/page.tsx`                | Login page            | Use Clerk components          |
| `app/signup/page.tsx`               | Signup page           | Use Clerk components          |
| `app/auth/confirm/route.ts`         | Email confirmation    | Remove - Clerk handles this   |
| `app/auth/auth-code-error/page.tsx` | Error page            | Remove or update              |

---

## Migration Architecture

```mermaid
flowchart TB
    subgraph Clerk
        A[Clerk Provider] --> B[User Authentication]
        B --> C[public_metadata]
        C --> D[role: startup/talent]
        C --> E[status: in_review/accepted/rejected]
    end

    subgraph NextJS App
        F[middleware.ts] --> G[Auth Protection]
        F --> H[Role-based Routing]
        I[Server Components] --> J[clerkClient]
        I --> K[Supabase Client]
        K --> L[PostgreSQL Data]
    end

    Clerk --> NextJS App
    J --> C
```

---

## Implementation Steps

### Phase 1: Clerk Setup and Configuration

#### 1.1 Install Clerk Dependencies

- Install `@clerk/nextjs` package
- Remove `@supabase/ssr` dependency if only used for auth

#### 1.2 Environment Variables

Add to `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### 1.3 Create Clerk Provider

Create `lib/clerk/provider.tsx` or add to root layout

#### 1.4 Create Middleware

Create new `middleware.ts` at project root with Clerk middleware

---

### Phase 2: Update Supabase Client for Database-Only Access

#### 2.1 Modify `lib/supabase/client.ts`

Remove auth-related code, keep only database client:

```typescript
// Create Supabase client for database operations only
import { createClient } from "@supabase/supabase-js";

export function createClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

#### 2.2 Modify `lib/supabase/server.ts`

Update for server-side database access without auth cookies

---

### Phase 3: Implement Clerk Authentication

#### 3.1 Create Auth Helper Functions

Create `lib/clerk/auth.ts` with:

- `getCurrentUser()` - Get current Clerk user
- `getUserRole()` - Get role from public_metadata
- `getUserStatus()` - Get status from public_metadata
- `getUserClaims()` - Get both role and status
- `hasRole()` - Check if user has specific role
- `isAccepted()` - Check if user is accepted
- `canAccessPlatform()` - Check platform access

#### 3.2 Create Middleware for Route Protection

Create `middleware.ts`:

- Protect private routes
- Implement role-based routing
- Handle status-based redirects

#### 3.3 Update Root Layout

Wrap app with `ClerkProvider`

---

### Phase 4: Update Authentication UI

#### 4.1 Replace Login Page

Update `app/login/page.tsx`:

- Use Clerk's `SignIn` component or custom flow
- Configure redirect URLs

#### 4.2 Replace Signup Page

Update `app/signup/page.tsx`:

- Use Clerk's `SignUp` component
- Add role selection during signup
- Set role in `public_metadata` on user creation

#### 4.3 Create Sign-in/Sign-up Routes

Create `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`

#### 4.4 Remove Old Auth Routes

- Delete `app/auth/confirm/route.ts`
- Delete `app/auth/auth-code-error/page.tsx`

---

### Phase 5: Update Server Actions

#### 5.1 Update `lib/actions.ts`

- Remove `signUpNewUser` and `loginNewUser` actions
- Remove `logInAction` - Clerk handles login
- Update `signOutAction` to use Clerk signOut
- Keep job-related actions but update user ID retrieval

#### 5.2 Create Webhook Handler

Create `app/api/webhooks/clerk/route.ts`:

- Handle `user.created` event
- Set initial role/status in public_metadata
- Create profile record in Supabase

---

### Phase 6: Update User Data Layer

#### 6.1 Update `lib/data/user.ts`

- Replace Supabase auth with Clerk's `currentUser()`
- Use Clerk user ID for database queries

#### 6.2 Update Profile Sync

Ensure profiles table uses Clerk user ID as primary key

---

### Phase 7: Database Migration

#### 7.1 Update Profiles Table

- Ensure `id` column can store Clerk user IDs (strings)
- Remove any Supabase Auth triggers
- Keep role/status columns for database queries if needed

#### 7.2 Update Foreign Keys

- Update any tables referencing `auth.users` to use Clerk user IDs
- Ensure RLS policies work with Clerk user IDs

---

### Phase 8: Update Components

#### 8.1 Update Navigation Components

- `components/nav-user.tsx` - Use Clerk's `UserButton` or custom user menu
- `components/app-sidebar.tsx` - Update sign-out functionality

#### 8.2 Update Layout Components

- Update sidebar layouts to use Clerk auth state

---

## File Changes Summary

### New Files to Create

| File                                  | Purpose                              |
| ------------------------------------- | ------------------------------------ |
| `middleware.ts`                       | Clerk middleware for auth protection |
| `lib/clerk/auth.ts`                   | Auth helper functions                |
| `app/sign-in/[[...sign-in]]/page.tsx` | Sign-in page                         |
| `app/sign-up/[[...sign-up]]/page.tsx` | Sign-up page                         |
| `app/api/webhooks/clerk/route.ts`     | Clerk webhook handler                |

### Files to Modify

| File                      | Changes                        |
| ------------------------- | ------------------------------ |
| `package.json`            | Add Clerk, remove Supabase SSR |
| `app/layout.tsx`          | Add ClerkProvider              |
| `lib/supabase/client.ts`  | Remove auth, DB only           |
| `lib/supabase/server.ts`  | Remove auth, DB only           |
| `lib/auth/role.ts`        | Rewrite for Clerk              |
| `lib/actions.ts`          | Update auth actions            |
| `lib/data/user.ts`        | Use Clerk user ID              |
| `app/login/page.tsx`      | Use Clerk SignIn               |
| `app/signup/page.tsx`     | Use Clerk SignUp               |
| `components/nav-user.tsx` | Use Clerk UserButton           |

### Files to Delete

| File                                | Reason                           |
| ----------------------------------- | -------------------------------- |
| `lib/supabase/proxy.ts`             | Replaced by Clerk middleware     |
| `app/auth/confirm/route.ts`         | Clerk handles email confirmation |
| `app/auth/auth-code-error/page.tsx` | No longer needed                 |

---

## Clerk Configuration Requirements

### User Metadata Schema

```typescript
// public_metadata structure
{
  role: 'startup' | 'talent',
  status: 'in_review' | 'accepted' | 'rejected'
}
```

### Clerk Dashboard Setup

1. Enable email/password authentication
2. Configure sign-in/sign-up URLs
3. Set up webhook for user creation
4. Configure redirect URLs

### Webhook Events to Handle

- `user.created` - Set initial metadata and create profile
- `user.updated` - Sync profile data if needed

---

## Testing Checklist

- [ ] Sign up as talent user
- [ ] Sign up as startup user
- [ ] Verify role is set correctly in metadata
- [ ] Test role-based routing
- [ ] Test status-based redirects (in_review, accepted, rejected)
- [ ] Test protected routes redirect to sign-in
- [ ] Test sign-out functionality
- [ ] Test database operations with Clerk user ID
- [ ] Verify RLS policies work with Clerk user IDs

---

## Rollback Plan

If issues arise during migration:

1. Keep Supabase Auth code in a separate branch
2. Environment variables can be swapped back
3. No user data migration means clean rollback is possible

---

## Questions Resolved

- **Role/Status Storage**: Using Clerk's `public_metadata` (recommended)
- **User Migration**: No production users, clean migration
- **Database**: Staying with Supabase PostgreSQL
