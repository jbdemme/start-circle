create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('talent', 'startup')),
  created_at timestamptz not null default now()
);
