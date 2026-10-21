# project-review-dashboard

Project Submission Dashboard lets students submit projects and mentors review them. This repository contains the Next.js frontend; the backend is a separate service accessed through typed API functions.

## What the system does

The application supports these backend roles:

- **Admin** can access the backend's administrative mentor-list endpoint.
- **Mentor** reviews student submissions and views submission statistics.
- **Student** registers, signs in, and submits project details.

Route guards protect the student and mentor dashboards. The API client sends the session cookies required by the backend.

## Main routes

| Route | Purpose |
| --- | --- |
| `/login`, `/registration` | Sign in and create an account |
| `/registration/verify-email` | Verify a registered email |
| `/student/submissions` | Submit a project |
| `/mentor/submissions` | Review submissions and view statistics |
| `/privacy-policy`, `/terms-of-service` | Public legal-information pages |

## Tech stack

- Next.js App Router and React
- TypeScript with strict checking
- Tailwind CSS v4, shadcn-style UI primitives, and Base UI
- TanStack Query for server state and cache management
- TanStack Form and Zod for forms and validation
- Biome for formatting and lint checks
- `ofetch` for HTTP requests

## Getting started

Use a supported Node.js LTS release and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and set the public API base URL used by the frontend:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com/api/v1
   ```

   The URL should point to the backend API root that exposes the `/auth`, `/user`, `/student`, `/mentor`, and `/submissions` endpoints. Do not commit `.env.local` or credentials.

   `next.config.ts` also contains a rewrite for `/api/v1/:path*` to the project's configured backend deployment. If you use that proxy instead of calling the backend origin directly, set the API base URL to the matching frontend-relative API prefix and confirm the cookie configuration is compatible with the proxy.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Next.js (normally `http://localhost:3000`).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve a production build |
| `npm run lint` | Run `biome check` |
| `npm run format` | Format supported project files with Biome |

## Application architecture

### Routes and layouts

`src/app` contains the App Router pages and layouts. Route groups organize authentication and dashboard UI without adding URL segments. The root layout installs the global styles, theme, React Query and tooltip providers, and toast notifications. Dashboard routes use an authentication guard, then each role's layout uses a role guard and the shared dashboard shell/sidebar.

Role-specific sidebar navigation is described in `src/routes`. The API-facing UI is organized into feature modules under `src/components/modules`, while reusable controls are in `src/components/ui` and `src/components/shared`.

### Data and API flow

Feature functions in `src/api` make typed requests through the shared `src/lib/ofetch.ts` client. The client includes browser credentials so cookie-based sessions can be sent. Query hooks in `src/hooks` wrap these functions with TanStack Query, manage cache keys, and invalidate dependent data after mutations. Shared response and domain types live in `src/types`; form schemas are in `src/schemas`.

The frontend expects API responses in the declared `ApiResponse<T>` shape where applicable. Pagination metadata is read from `meta`; query parameters are passed through feature-specific hooks. Authentication and role guards obtain the current user from the profile endpoint.

### Authentication

Credential sign-in and registration use the `/auth` API functions; email verification is handled through a verification code flow. Google OAuth begins with a browser redirect to the backend. After the provider callback, `/oauth-progress` requests the signed-in profile and redirects to the workspace associated with the role. The backend must set a session cookie that is accepted by the browser and sent with credentialed API calls; production also requires matching CORS origins and OAuth callback URLs.

### Submissions

Students submit project name, repository URL, live URL, and description. Mentors review pending submissions, filter by status, and view aggregated submission statistics.

## Project structure

```text
src/
  api/          Typed backend requests
  app/          App Router routes and layouts
  components/   UI, forms, shared components, and feature modules
  hooks/        TanStack Query and UI hooks
  lib/          HTTP client and shared utilities
  providers/    Theme, query, and tooltip providers
  routes/       Role-specific dashboard navigation
  schemas/      Zod validation schemas
  types/        API and domain types
  utils/        Formatting and UI helpers
public/         Static images and assets
```

## Development notes

- Keep API request/response types aligned with the backend contracts.
- Reuse the existing UI primitives, query hooks, and form schemas when extending features.
- Handle loading, empty, and error states explicitly for asynchronous data.
- Do not expose secrets in `NEXT_PUBLIC_*` variables; those values are bundled into browser code.
- Check auth cookies, CORS, OAuth callback settings, and frontend/API origins together when diagnosing production sign-in problems.