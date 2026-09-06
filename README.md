# Librarian Field Tool

A PWA scaffolded from the same framework as the
[Sales Field Tool](https://github.com/kendricantonio-lang/sales-field-tool) —
same design system, auth pattern, and config-driven field pattern. The
library-specific features (tabs, data model) haven't been built yet; this is
just the shell.

## Stack

- React + TypeScript + Vite
- Supabase (Postgres + Auth) for storage and cross-device sync
- `vite-plugin-pwa` for the installable app manifest + offline service worker

## What's here vs. what's not

- **Here:** login/signup, the hamburger side-menu shell, the shared design
  system ([src/index.css](src/index.css)), and the same config-driven field
  pattern as the sales tool ([src/config/fields.ts](src/config/fields.ts) +
  [src/components/DynamicForm.tsx](src/components/DynamicForm.tsx)) ready to
  use once real entities are defined.
- **Not here yet:** any actual library-specific tabs, data tables, or
  Supabase schema — there's a single placeholder "Home" tab
  ([src/pages/HomePage.tsx](src/pages/HomePage.tsx)). Add new tabs by adding a
  page component, a route in [src/App.tsx](src/App.tsx), and an entry in its
  `NAV_LINKS` array.
- To add a new record type (e.g. Patrons, Catalog items): define a
  `FieldDef[]` in `fields.ts`, add a Supabase table with a flexible `data`
  JSONB column + row-level security scoped to `user_id` (same shape as
  `sales-field-tool/supabase/schema.sql` — copy that pattern), and add
  `list/create/update/delete` helpers in a new `src/lib/db.ts`.

## One-time setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project (a
   separate one from any other app's, so this app's data stays isolated).
2. Once there's an actual data model, add the corresponding tables + RLS
   policies via the SQL Editor (see above).
3. In **Project Settings > API**, copy the **Project URL** and the **anon
   public** key.

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### 3. Run locally

```bash
npm install
npm run dev
```

Each person who uses the app signs up for their own account on the login
screen — nobody needs your Supabase account credentials. The
`VITE_SUPABASE_ANON_KEY` is a public, RLS-restricted key, safe to ship in the
client bundle; it's not a login.

## Deploying

Push to GitHub, then import into [Vercel](https://vercel.com) (free Hobby
tier). Set the same two env vars in the project settings. Build command
`npm run build`, output directory `dist`.

## Installing on iOS

Open the deployed URL in Safari, tap the Share icon, then **Add to Home
Screen**.
