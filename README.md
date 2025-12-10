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

````markdown
# SchoolApp

A Next.js + TypeScript application for managing school entries (local project workspace).

**Overview:**

- Web app built with Next.js (app router) that provides pages to list, add, edit schools and includes API routes under `app/api/` for authentication, file upload and schools data.

**Tech Stack**

- **Framework:** Next.js (app router)
- **Language:** TypeScript
- **UI / Styling:** Tailwind CSS (+ `tailwindcss-animate`), Radix UI primitives, Lucide icons
- **Forms & Validation:** `react-hook-form`, `zod`, `@hookform/resolvers`
- **DB / Serverless:** `@neondatabase/serverless` (Neon for serverless Postgres)
- **Build / Tooling:** `npm` (or `pnpm`), PostCSS, Tailwind, TypeScript

**Key Packages (core vs optional)**

- Core packages used by the app:
  - `next`, `react`, `react-dom`
  - `tailwindcss`, `autoprefixer`, `postcss`
  - `react-hook-form`, `zod`, `@hookform/resolvers`
  - `@neondatabase/serverless` (Neon driver) — used to connect to the Postgres-compatible Neon database
- Optional / integrations (remove if you don't use them):
  - `@vercel/analytics`, `@vercel/blob` — Vercel integrations (analytics and serverless blob storage)
  - UI helpers and extras like `recharts`, `embla-carousel-react`, `sonner`, etc. — useful for charts, carousels and toasts but not required for core functionality

Full dependency list is available in `package.json`.

**Database (Neon)**

- This project uses Neon (a serverless Postgres provider) via the `@neondatabase/serverless` package. Neon provides a managed, serverless Postgres-compatible database that works well with serverless deployments (e.g., Vercel). The main environment variable is `DATABASE_URL` (see `.env.local`). Use Neon for storing schools, user accounts and other persistent data.

**Blob storage (Vercel Blob)**

- The project includes optional support for Vercel Blob storage (via `@vercel/blob`) to handle file uploads (for example, school images or documents). If used, environment variables in `.env.local` will include `BLOB_READ_WRITE_TOKEN` and `BLOB_STORE_ID` (do not commit these). If you are not using file uploads or Vercel Blob, you can safely remove the `@vercel/blob` package and the related env vars.

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
npm install
```

2. Add environment variables:

- Create `.env.local` in the project root and add DB connection strings and any secret keys. Example variables the app may use:
  - `DATABASE_URL` (Neon connection string)
  - `BLOB_READ_WRITE_TOKEN` and `BLOB_STORE_ID` (if using Vercel Blob)
  - `NEXT_PUBLIC_...` keys for public values

3. Run development server:

```powershell
npm run dev
```

4. Open `http://localhost:3000` and use the UI pages:

- `/schools` — list schools
- `/add-school` — add new school (uses `components/add-school-form.tsx`)
- `/edit-school/[id]` — edit an existing school

5. API routes & data flow:

- Client pages call internal API routes under `app/api/*`.
- Example: the add-school form posts to `app/api/schools/route.ts` which uses `lib/db.ts` to persist data.
- Authentication routes exist under `app/api/auth/*` (`login`, `logout`, `register`, `me`).

**Scripts** (from `package.json`)

- `npm run dev` — run Next.js in development mode
- `npm run build` — build for production
- `npm start` — run the built app
- `npm run lint` — run ESLint (if configured)

**Testing & Linting**

- There are no test scripts bundled by default; consider adding `vitest`/`jest` and test commands if you want automated tests.

**Deployment**

- The project is ready for Vercel deployments (Next.js defaults). Ensure environment variables are set in the hosting environment (e.g., Vercel dashboard) and that any serverless DB connection (Neon) is configured.

**Contributing**

- Fork and open a PR. Keep changes small and focused. Run lint and build locally before submitting.

**Notes & Next steps**

- I replaced `pnpm` commands with `npm` examples and called out optional packages (Vercel integrations and UI extras) that you can remove if unnecessary.
- If you want, I can remove unused packages from `package.json` and tidy dependencies.

---

If you'd like, I can also:

- commit and push these changes to your repo, or
- add a `CONTRIBUTING.md` and a simple GitHub Actions workflow to run `npm run build` on push.
````
