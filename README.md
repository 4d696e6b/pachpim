# Portfolio and private admin platform

A production-focused personal portfolio and private CMS built with Next.js 16, TypeScript, Firebase Authentication, Cloud Firestore, Firebase Admin, Tailwind CSS, shadcn-style primitives, React Hook Form, Zod, and Framer Motion.

Public pages are server-rendered and expose only published content. The dashboard uses a revoked-session-aware Firebase session cookie and requires both an `admin: true` custom claim and an allowlisted email.

## Features

- Portfolio home, about, projects, project case studies, notes, articles, and contact
- Search and filtering for projects and notes
- Markdown rendering with raw HTML disabled and safe outbound URLs
- Project and note draft/publish workflows with transactional unique slugs
- Profile, skills, experience, education, certifications, achievements, and social links
- Private media uploads with MIME/size checks, progress, previews, visibility, and deletion
- Contact inbox with read/archive/delete workflows
- Firestore-backed, hashed-IP contact rate limiting and a honeypot
- Light/dark themes, accessible dialogs, keyboard focus, reduced motion, loading and empty states
- Metadata, Open Graph image, JSON-LD, sitemap, robots, and canonical URLs
- Complete Firestore Security Rules

Sample content is explicitly labeled. Replace it before launch; it does not contain testimonials, customer logos, or claimed business results.

## Architecture

```text
src/
  app/
    (public)/          Server-rendered portfolio routes
    admin/             Dynamically rendered protected dashboard
    api/               Session, contact, and media route handlers
    login/
  components/          Layout, shared, admin, and UI primitives
  features/            Auth, projects, notes, profile, messages, media
  lib/
    auth/              Session and authorization checks
    firebase/          Browser SDK initialization
    server/            Admin SDK and Firestore repositories
    security/          URL and reading-time utilities
    validation/        Shared Zod schemas
  types/               Typed domain models and DTOs
scripts/               Sample seeding and admin-claim management
```

The Firebase browser SDK is used only for sign-in. Public reads, media, and privileged operations run through the Admin SDK. Firebase Rules remain defense in depth for browser requests.

## Local setup

Requirements:

- Node.js 20.19+, 22.13+, or 24+
- A Firebase project with Authentication and Firestore enabled
- Firebase CLI for rules/index deployment: `npm install -g firebase-tools`

Install and configure:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

### Firebase console

1. Create or select a Firebase project.
2. In Authentication, enable Email/Password. Optionally enable Google.
3. Do not enable public registration in this application. Create the administrator account manually in the Firebase console.
4. Create a Firestore database in the same project. Storage is not required; images are stored in Firestore.
5. In Project settings, create a Web App and copy its browser values to the `NEXT_PUBLIC_FIREBASE_*` variables.
6. In Project settings → Service accounts, create a private key. Set the server-only Admin variables from that JSON:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
7. Keep the private key quoted with escaped `\n` characters on Vercel. The Admin initializer converts them to real newlines.
8. Set `ADMIN_EMAIL_ALLOWLIST` to one or more comma-separated administrator emails.
9. Generate `RATE_LIMIT_SECRET` with at least 32 random bytes, for example `openssl rand -base64 48`.

The Firebase web API key is not a secret. Service account values, rate-limit secrets, and session credentials are server-only and must never use the `NEXT_PUBLIC_` prefix.

### Grant administrator access

The account must exist in Firebase Authentication and its email must be in `ADMIN_EMAIL_ALLOWLIST`.

```bash
npm run admin:grant -- --email you@example.com
```

You may use `--uid UID` instead. Remove access with:

```bash
npm run admin:grant -- --email you@example.com --remove
```

After changing claims, sign out and sign in again to refresh the ID token.

### Deploy rules and indexes

Authenticate and select the Firebase project:

```bash
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,firestore:indexes
```

The rules require the custom admin claim for writes. Public browser reads require both `status == "published"` and `visibility == "public"`. Messages, users, drafts, slug reservations, rate limits, and private media are never publicly readable.

For automatic cleanup, enable a Firestore TTL policy on `rateLimits.expiresAt`.

### Seed replaceable sample content

With valid Admin credentials in `.env.local`:

```bash
npm run seed
```

This writes four projects, six skills, three timeline entries, and two notes. The operation uses stable sample IDs and can be rerun. All content is marked as sample and can be replaced from `/admin`.

## Media workflow

Images and PDFs are stored as Firestore documents, not Firebase Storage objects. Firestore documents are limited to 1 MB, so uploads are capped at 700 KB.

1. Upload from the media library, a project, a note, or the profile form.
2. New files stay private until you publish them.
3. Copy the public URL (`/api/media/{id}/file`) and paste it into a cover, gallery, photo, or résumé field.

Private files are only served to signed-in administrators. Deleting a media record removes the bytes from Firestore.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Add every variable from `.env.example` to the correct Preview and Production environments.
3. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS production URL.
4. Add the Vercel domains to Firebase Authentication → Authorized domains.
5. Deploy. Vercel detects Next.js automatically.
6. Run the Firebase rules/index deployment separately with the Firebase CLI.
7. Verify `/robots.txt`, `/sitemap.xml`, sign-in, an upload, and a contact submission.

Admin routes are dynamically rendered. Public content uses five-minute revalidation and explicit cache invalidation after dashboard updates.

## Commands

```bash
npm run dev           # development server
npm run lint          # ESLint
npm run typecheck     # strict TypeScript check
npm test              # validation and security-contract tests
npm run format:check  # Prettier check
npm run build         # production build
npm run seed          # seed labeled sample content
npm run admin:grant   # manage the Firebase admin claim
```

## Security notes

- Authorization never uses `localStorage`.
- The early route guard is only a convenience redirect. The admin layout, route handlers, and every mutation re-verify the signed session and approval policy.
- Session cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- Contact messages are accepted only by the validated server route; browser Firestore writes are denied.
- Markdown raw HTML is disabled. Links permit only HTTP(S), mail, hash, or site-relative destinations.
- CSP and other security headers are configured in `next.config.ts`.
- Do not log, commit, or expose `.env.local`, service-account JSON, private keys, or private media URLs.
