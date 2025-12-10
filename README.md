# SchoolApp

A Next.js + TypeScript application for managing school entries (local project workspace).

**Overview:**

- Web app built with Next.js (app router) that provides pages to list, add, edit schools and includes API routes under `app/api/` for authentication, file upload and schools data.

**Tech Stack**

- **Framework:** Next.js (app router)
- **Language:** TypeScript
- **UI / Styling:** Tailwind CSS (+ `tailwindcss-animate`), Radix UI primitives, Lucide icons
- **Forms & Validation:** `react-hook-form`, `zod`, `@hookform/resolvers`
- **DB / Serverless:** `@neondatabase/serverless` (used for database access in serverless mode)
- **Build / Tooling:** pnpm (recommended), PostCSS, Tailwind, TypeScript

**Key Packages**

- `next` — framework
- `react`, `react-dom` — UI library
- `tailwindcss`, `autoprefixer`, `postcss` — styling
- `react-hook-form`, `zod`, `@hookform/resolvers` — forms + validation
- `@neondatabase/serverless` — serverless DB driver (Neon)
- `@vercel/analytics`, `@vercel/blob` — Vercel integrations (optional)
- `sonner` — toast notifications
- `recharts` — charts
- `date-fns` — date utilities
- Radix UI packages (`@radix-ui/*`) — accessible UI primitives

Full dependency list is available in `package.json`.

**Project Structure (important files / folders)**

- `app/` — Next.js app router pages and API routes (e.g. `app/api/schools/route.ts`, `app/api/auth/*`)
- `components/` — React components (forms, header, footer, UI primitives)
- `components/ui/` — shared UI wrapper components
- `lib/` — helpers like `db.ts` and `auth.ts`
- `hooks/` — custom hooks
- `styles/` — global CSS (Tailwind entry)
- `scripts/` — SQL migration scripts

**Development workflow**

1. Install dependencies:

```powershell
pnpm install
```

2. Add environment variables:

- Create `.env.local` in the project root and add DB connection strings and any secret keys. Example variables the app may use:
  - `DATABASE_URL` or Neon connection settings
  - `NEXT_PUBLIC_...` keys for public values

3. Run development server:

```powershell
pnpm dev
```

4. Open `http://localhost:3000` and use the UI pages:

- ` /schools` — list schools
- ` /add-school` — add new school (uses `components/add-school-form.tsx`)
- ` /edit-school/[id]` — edit an existing school

5. API routes & data flow:

- Client pages call internal API routes under `app/api/*`.
- Example: the add-school form posts to `app/api/schools/route.ts` which uses `lib/db.ts` to persist data.
- Authentication routes exist under `app/api/auth/*` (`login`, `logout`, `register`, `me`).

**Scripts** (from `package.json`)

- `pnpm dev` — run Next.js in development mode
- `pnpm build` — build for production
- `pnpm start` — run the built app
- `pnpm lint` — run ESLint (if configured)

**Testing & Linting**

- There are no test scripts bundled by default; consider adding `vitest`/`jest` and test commands if you want automated tests.

**Deployment**

- The project is ready for Vercel deployments (Next.js defaults). Ensure environment variables are set in the hosting environment (e.g., Vercel dashboard) and that any serverless DB connection (Neon) is configured.

**Contributing**

- Fork and open a PR. Keep changes small and focused. Run lint and build locally before submitting.

**Notes & Next steps**

- If you want, I can add a `CONTRIBUTING.md`, CI (GitHub Actions) to run lint/build, or a `Dockerfile` for containerized runs.

---

If you'd like, I can also:

- commit and push these changes to your repo, or
- add a `CONTRIBUTING.md` and a simple GitHub Actions workflow to run `pnpm build` on push.
