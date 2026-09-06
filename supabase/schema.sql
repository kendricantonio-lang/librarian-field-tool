-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query) once
-- per project. Field values live in a flexible `data` JSONB column so adding
-- or renaming fields in src/config/fields.ts never requires a migration.
--
-- Add a new "create table if not exists <name> (...)" block here (copying
-- the shape below) each time a new tab's data model is defined.

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_user_id_idx on events (user_id);

alter table events enable row level security;

drop policy if exists "Users manage own events" on events;
create policy "Users manage own events" on events
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists teachers_user_id_idx on teachers (user_id);

alter table teachers enable row level security;

drop policy if exists "Users manage own teachers" on teachers;
create policy "Users manage own teachers" on teachers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- data.teacherIds is a JSON-encoded array of teacher ids (which classes a
-- book has been read to) — see src/lib/teacherLinks.ts.
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists books_user_id_idx on books (user_id);

alter table books enable row level security;

drop policy if exists "Users manage own books" on books;
create policy "Users manage own books" on books
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
