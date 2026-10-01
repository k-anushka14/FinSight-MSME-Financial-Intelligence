# FinSight — MSME Financial Intelligence Platform

FinSight is a financial operations workspace for small and medium-sized businesses. It brings day-to-day business records, cash-flow visibility, receivables, payables, supplier spend, alerts, reports, and conversational analysis into one authenticated application.

## Overview

Many MSMEs manage revenue, expenses, supplier payments, customer collections, and cash planning across spreadsheets and messaging threads. FinSight provides a single workspace for recording those events, understanding financial movement, and preparing practical next actions from the records already available to the business.

The current project is a pnpm monorepo containing a React/Vite web application, an Express API, shared TypeScript packages, and a Drizzle ORM database package.

## Key Features

- **Financial dashboard** with revenue, expenses, net cash flow, financial health, categories, receivables, alerts, and forecast views.
- **Revenue and expense tracking** with business-linked records, categories, vendors/customers, dates, status, and source.
- **Transactions ledger** for searching and reviewing financial entries.
- **Receivables monitoring** with customer, invoice, amount, due date, and collection status.
- **Payables monitoring** with vendor, reference, amount, due date, priority, and status.
- **Vendor directory and spend views** for supplier information and vendor-linked expenses.
- **Financial analytics** including expense categories, vendor spend, trends, health indicators, and month-on-month comparisons.
- **Cash-flow forecasting** with configurable 30-, 60-, and 90-day views based on workspace records.
- **Alerts and recommendations** for financial signals and anomalies detected by the application’s financial calculations.
- **What-if simulator** for adjusting assumptions and viewing the calculated cash impact.
- **Invoice intelligence** for uploading an invoice image/PDF and extracting fields for review.
- **Reports** including monthly management, receivables aging, and vendor spend review views.
- **PDF export** that generates a real client-side PDF from current workspace data, including business details, financial totals, record counts, and recent transactions.
- **Business Copilot** powered by Google Gemini, with authenticated backend requests, workspace context, and recent conversation history.
- **WhatsApp transaction entry** through a public Twilio-compatible webhook. Supported messages can create revenue or expense transactions, return help, and undo the most recent entry.
- **Multilingual UI** with English, Hindi, and Marathi selection persisted in browser local storage.
- **Clerk authentication** for sign-in, sign-up, OTP flows, and protected API routes.
- **Responsive dark visual system** with shared glass surfaces, charts, motion primitives, focus states, and reduced-motion support.

## AI Business Copilot

Business Copilot is implemented as an authenticated FinSight API route:

1. A signed-in user asks a question in the Copilot page.
2. The frontend sends the request through the existing authenticated API client.
3. The backend resolves the business from the Clerk-authenticated user.
4. The backend builds a bounded context from authorized business data, including business details, financial summaries, recent transactions, vendors, receivables, and payables.
5. The backend sends that context and recent conversation history to Google Gemini.
6. The response is returned to the existing Copilot UI.

The Gemini API key is read only from the backend `GEMINI_API_KEY` environment variable. It must never be placed in a Vite `VITE_*` variable or exposed to the browser.

## WhatsApp Integration

The implemented transaction-entry flow is:

```text
WhatsApp
   ↓
Twilio
   ↓
Public HTTPS webhook
   ↓
FinSight Express backend
   ↓
PostgreSQL database
   ↓
FinSight dashboard
```

The backend endpoint is:

```text
POST /api/whatsapp/webhook
```

The webhook matches the sender’s WhatsApp phone number to the business record, parses supported messages, writes revenue or expense transactions, and returns TwiML XML for Twilio to send back to the user. The webhook is intentionally not protected by Clerk because Twilio does not have a Clerk session; phone-number-to-business matching is used for routing.

For local development, expose the backend with ngrok and configure Twilio to call the resulting HTTPS URL. Production should use a deployed HTTPS backend URL rather than ngrok.

## Reports & PDF Export

The Reports page currently provides monthly management, receivables aging, and vendor spend review cards. The export action currently implemented in the frontend generates a PDF with `jspdf` and triggers a browser download.

The generated document includes:

- Business name, industry, and location
- Generation date
- Revenue, expenses, and net cash flow
- Counts of transactions, receivables, payables, and invoices
- A recent transaction list

Downloaded filenames follow this pattern:

```text
FinSight-<report-name>-YYYY-MM.pdf
```

## Internationalization

The application supports:

- English (`en`)
- Hindi (`hi`)
- Marathi (`mr`)

The language selector is rendered by the frontend language provider. The selected language is stored in `localStorage` under `finsight_lang`, so it persists across reloads in the same browser. Shared UI components use the centralized translation helper and fall back to English when a string does not have a translated entry. Business-entered values, IDs, amounts, phone numbers, URLs, and database records are not translated.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Wouter routing
- TanStack React Query
- Recharts
- React Hook Form
- Zod
- `jspdf`

### Backend

- Node.js
- Express 5
- TypeScript
- Pino and pino-http logging
- CORS
- Shared workspace API schemas

### Database

- PostgreSQL-compatible database
- `pg`
- Drizzle ORM
- Drizzle Kit
- The project can be used with a hosted PostgreSQL provider such as Supabase when configured through `DATABASE_URL`.

### Authentication

- Clerk React
- Clerk Express
- Clerk shared key/proxy support

### AI

- Google Gemini through `@google/genai`

### Messaging

- Twilio-compatible WhatsApp webhook using Express form handling and TwiML XML responses

### UI/Animation

- Tailwind CSS 4
- Tailwind CSS Vite plugin
- Radix UI primitives
- Framer Motion
- Lucide React
- Sonner notifications
- `next-themes`

### Build/Deployment Tools

- pnpm workspaces
- TypeScript project references
- esbuild backend bundling
- Vite production builds
- Drizzle Kit schema push
- ngrok for local webhook testing

## Architecture

```mermaid
flowchart TD
    User[User]
    Frontend[FinSight Frontend<br/>React + Vite]
    API[Authenticated API<br/>Clerk token]
    Backend[FinSight Backend<br/>Express]
    DB[(PostgreSQL / Supabase)]
    Gemini[Google Gemini]
    WhatsApp[WhatsApp]
    Twilio[Twilio]
    Webhook[Public WhatsApp webhook]

    User --> Frontend
    Frontend --> API
    API --> Backend
    Backend --> DB
    Backend --> Gemini
    WhatsApp --> Twilio
    Twilio --> Webhook
    Webhook --> Backend
```

## Project Structure

```text
.
├── artifacts/
│   ├── finsight/              # React/Vite frontend application
│   │   └── src/
│   ├── api-server/            # Express API, auth middleware, Copilot, webhook
│   │   └── src/
│   └── mockup-sandbox/        # Separate Vite mockup workspace
├── lib/
│   ├── api-client-react/      # Shared generated API client and authenticated fetch
│   ├── api-zod/               # Shared request/response validation schemas
│   └── db/                    # Drizzle schema, PostgreSQL client, and Drizzle Kit config
├── scripts/                   # Repository scripts
├── attached_assets/           # Workspace assets
├── screenshots/               # Existing screenshot assets, if present
├── pnpm-workspace.yaml        # Workspace packages and dependency catalog
├── pnpm-lock.yaml             # Locked dependency graph
└── tsconfig.base.json         # Shared TypeScript configuration
```

## Prerequisites

- Node.js with support for the repository’s current dependency set (Node.js 20+ is recommended).
- pnpm 12.x or a compatible current pnpm release. The repository was validated with pnpm 12.4.2.
- A PostgreSQL-compatible database.
- A Clerk application and its publishable/secret keys.
- A Google Gemini API key for Business Copilot.
- A Twilio WhatsApp sender and public webhook URL for WhatsApp testing.
- ngrok is optional and is used only to expose a local backend during webhook development.

## Environment Variables

The repository ignores `.env` and `.env.*` files by default. Use safe local files or shell environment variables; never commit secret values.

### Frontend variables

Required by the current Vite configuration:

```text
PORT=5173
BASE_PATH=/
```

Required for the Clerk frontend:

```text
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Optional:

```text
VITE_CLERK_PROXY_URL=https://your-clerk-proxy-host
API_PROXY_TARGET=http://localhost:8787
```

`API_PROXY_TARGET` is used by Vite for `/api` requests and defaults to `http://localhost:8787`.

### Backend variables

```text
PORT=8787
NODE_ENV=development
LOG_LEVEL=info
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

`CLERK_SECRET_KEY` and `GEMINI_API_KEY` must remain server-side. Do not prefix them with `VITE_`.

### Database variables

```text
DATABASE_URL=postgresql://user:password@host:5432/database
```

`DATABASE_URL` must remain server-side and must never be bundled into the frontend.

### Third-party integration variables

The current source code does not read a `TWILIO_*` environment variable. Twilio sends form-encoded webhook data to the public backend endpoint, and the backend responds with TwiML. Configure the Twilio webhook URL in the Twilio console rather than placing credentials in frontend code.

## Local Development

### 1. Install dependencies

From the repository root:

```bash
pnpm install
```

### 2. Configure environment variables

Create a local environment file or export the variables in each shell. The current Node/Vite scripts expect variables to be available in the process environment; use your preferred environment loader if your shell does not load `.env` automatically.

Git Bash example:

```bash
export DATABASE_URL='postgresql://user:password@host:5432/database'
export CLERK_PUBLISHABLE_KEY='your_clerk_publishable_key'
export CLERK_SECRET_KEY='your_clerk_secret_key'
export GEMINI_API_KEY='your_gemini_api_key'
```

In a frontend terminal:

```bash
export PORT=5173
export BASE_PATH=/
export VITE_CLERK_PUBLISHABLE_KEY='your_clerk_publishable_key'
export API_PROXY_TARGET='http://localhost:8787'
```

### 3. Start the backend

In a terminal where backend and database variables are loaded:

```bash
export PORT=8787
pnpm --filter @workspace/api-server run dev
```

The backend builds first and then starts on port `8787` by default.

### 4. Start the frontend

In a second terminal:

```bash
export PORT=5173
export BASE_PATH=/
pnpm --filter @workspace/finsight run dev
```

Open the Vite URL shown in the terminal. The frontend proxies `/api` requests to the backend.

### 5. Optional local WhatsApp testing

With the backend running locally:

```bash
ngrok http 8787
```

Set the Twilio WhatsApp incoming-message webhook to:

```text
https://<your-ngrok-subdomain>/api/whatsapp/webhook
```

Use a deployed HTTPS backend URL for production.

## Database Setup

The database package uses Drizzle ORM with PostgreSQL and defines its schema in `lib/db/src/schema/index.ts`. The current package exposes schema push commands rather than a migration-generation workflow:

```bash
pnpm --filter @workspace/db run push
```

This command requires `DATABASE_URL` in the environment. The force variant exists but should be used only when you understand the consequences:

```bash
pnpm --filter @workspace/db run push-force
```

## Gemini Setup

Create or export the backend-only variable:

```bash
export GEMINI_API_KEY='your_gemini_api_key'
```

Start the backend with that variable available. Business Copilot calls Google Gemini from the authenticated Express backend; the key is never sent to the frontend. Do not use `VITE_GEMINI_API_KEY`.

## WhatsApp/Twilio Setup

1. Create or configure a Twilio WhatsApp sender.
2. Start the FinSight backend.
3. Configure the sender’s incoming-message webhook to:

   ```text
   https://<public-backend-host>/api/whatsapp/webhook
   ```

4. Store the business WhatsApp number in the FinSight workspace so incoming messages can be matched to that business.
5. Send supported revenue, expense, help, or undo messages and confirm the resulting transaction appears in the dashboard.

For local development, use ngrok to provide the HTTPS webhook URL. ngrok is a development tunnel, not a production hosting solution. Production should use a deployed backend with HTTPS and an appropriate Twilio configuration.

## Deployment

FinSight requires separate deployable concerns:

- **Frontend:** Build and serve `artifacts/finsight` with Vite. Provide `PORT`, `BASE_PATH`, and the frontend Clerk publishable key. Configure the `/api` proxy or deployment routing to reach the backend.
- **Backend:** Build `artifacts/api-server` with esbuild and run its generated Node entrypoint. Provide `PORT`, Clerk server configuration, `DATABASE_URL`, and `GEMINI_API_KEY`.
- **Database:** Use a reachable PostgreSQL-compatible database and run the repository’s Drizzle push command as appropriate for the target environment.
- **Clerk:** Configure the production publishable key, secret key, allowed origins, redirect URLs, and any Clerk proxy settings required by the deployment.
- **Gemini:** Configure `GEMINI_API_KEY` only in the backend runtime.
- **Twilio:** Point the WhatsApp incoming-message webhook at the deployed backend’s HTTPS `/api/whatsapp/webhook` endpoint.

This repository documents the required architecture; it does not claim that a production deployment is already completed.

## Security

- Never commit `.env`, `.env.local`, or any file containing credentials.
- Never expose `CLERK_SECRET_KEY`, `DATABASE_URL`, `GEMINI_API_KEY`, or Twilio credentials to the Vite client.
- Never create a `VITE_GEMINI_API_KEY` or similar client-side secret variable.
- Keep API access behind the existing Clerk authentication flow where authentication is required.
- Use HTTPS for production frontend, API, and webhook traffic.
- Validate and monitor public webhook traffic in production according to the Twilio deployment model.
- Do not use ngrok as a production hosting solution.
- Avoid printing credentials or full environment values in logs.

## Testing

The following validations have been run against the current workspace:

```bash
pnpm --filter @workspace/finsight run typecheck
pnpm --filter @workspace/finsight run build
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server run build
```

Frontend builds require the Vite variables `PORT` and `BASE_PATH` to be present. The project does not currently provide a dedicated automated browser-test suite in the inspected packages. Browser-level login, WhatsApp, and production deployment tests should be added separately.

## Screenshots

Add real screenshots here as the project is documented:

- Login — `docs/screenshots/login.png`
- Dashboard — `docs/screenshots/dashboard.png`
- Analytics — `docs/screenshots/analytics.png`
- Reports — `docs/screenshots/reports.png`
- Business Copilot — `docs/screenshots/business-copilot.png`
- WhatsApp integration — `docs/screenshots/whatsapp.png`
- Hindi/Marathi UI — `docs/screenshots/multilingual-ui.png`

No placeholder or fabricated screenshots are included by this README.

## Future Improvements

Potential future work, not current functionality:

- Add automated frontend, backend, webhook, and PDF integration tests.
- Add a formal translation-key completeness check for every supported language.
- Add generated database migrations and a documented migration promotion workflow.
- Add server-side report/PDF generation for large or scheduled reports.
- Add Twilio signature validation and production webhook observability as deployment requirements evolve.
- Add CI checks for typecheck, build, secret scanning, and documentation validation.
- Add production deployment manifests and environment-specific configuration.

## License

The root package declares the MIT license. If this project is published, include the standard MIT license text in a `LICENSE` file.

## Credits

FinSight uses and integrates:

- React, TypeScript, Vite, and Tailwind CSS
- Express and Node.js
- PostgreSQL-compatible storage with Drizzle ORM
- Clerk for authentication
- Google Gemini for Business Copilot
- Twilio-compatible WhatsApp webhook delivery
- Recharts for data visualization
- Framer Motion for UI animation
- Radix UI and Lucide React for interface primitives and icons
- pnpm workspaces and esbuild for repository tooling

