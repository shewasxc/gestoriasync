# GestoriaSync — frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui.

- `app/page.tsx` — marketing landing page
- `app/dashboard/page.tsx` — upload → process → review → export flow
- `lib/api.ts` — typed fetch wrappers over the FastAPI backend

See the [project root README](../README.md) for the full architecture, setup instructions, and API reference.

## Development

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Requires the FastAPI backend running (see root README) — `NEXT_PUBLIC_API_URL` in `.env.local` points to it.
