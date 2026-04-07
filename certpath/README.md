# CertPath — Cloud Integration

CertPath is an interactive certification roadmap explorer. This branch extends the base application with Supabase cloud integration: certification and occupation data is stored in a cloud database, users can create an account via magic link, and certification progress syncs across devices.

## Instructions for Build and Use

Steps to build and run the software:

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project at [supabase.com](https://supabase.com) and copy your project URL, anon key, and service role key.
3. Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Run the SQL schema in the Supabase SQL Editor to create the `certs`, `occupations`, and `user_progress` tables with Row Level Security policies.
5. Seed the database with the existing certification data:
   ```bash
   node --env-file=.env.local scripts/seed.mjs
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser.

Instructions for using the software:

1. Select an industry from the homepage grid to browse career paths.
2. Click an occupation to open the interactive certification roadmap flowchart.
3. Click any cert node in the flowchart or browse `/certs` to view full certification details.
4. Use the "Mark as Completed" button on any cert to track your progress — progress is saved locally without an account.
5. To sync progress across devices, sign in via the login option (a magic link is sent to your email). Your local progress is automatically uploaded on first login and stays in sync going forward.

## Development Environment

To recreate the development environment, you need the following software and/or libraries with the specified versions:

* Node.js 20.6 or later (required for `--env-file` flag used by the seed script)
* Next.js 16.1.6
* React 18
* @supabase/supabase-js 2.x
* @supabase/ssr 0.10.x
* Framer Motion 11.1.7
* React Flow (reactflow) 11.11.3
* A Supabase project (free tier is sufficient)

## Useful Websites to Learn More

I found these websites useful in developing this software:

* [Supabase Documentation](https://supabase.com/docs) — database, auth, and Row Level Security guides
* [Supabase Auth with Next.js App Router](https://supabase.com/docs/guides/auth/server-side/nextjs) — SSR session handling with @supabase/ssr
* [Next.js App Router Documentation](https://nextjs.org/docs/app) — Server Components, async page functions, generateStaticParams
* [Row Level Security in Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security) — how RLS policies control data access

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [ ] Login UI — add a sign-in modal or dedicated `/login` page with magic link and OAuth (Google/GitHub) options
* [ ] Admin panel — allow adding and editing cert and occupation cards directly from the UI without running the seed script
* [ ] Live salary data — integrate with O*NET or Bureau of Labor Statistics API for up-to-date salary ranges
* [ ] Shareable roadmap URLs — generate a link to share a specific occupation roadmap with progress state encoded
