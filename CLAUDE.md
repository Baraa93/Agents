# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

A personal **Revenue Growth Agent** for the founder's business — a Next.js 16 app (App Router, Turbopack, Tailwind v4, Framer Motion) with a Claude-powered orchestrator that takes a founder brief and returns a commercially useful growth plan. There is also a **legacy "agency intake"** flow (strategy / content / ads per-service agents) kept around but demoted in the UI.

## Commands

```bash
npm run dev          # Next.js dev server (Turbopack) on :3000
npm run build        # production build
npm start            # run the production build
npm run lint         # ESLint
npx tsc --noEmit     # type-check without emitting
```

There are no tests in this project.

## Architecture

The App Router uses a **`(dashboard)` route group** so the sidebar + mobile top bar in `app/(dashboard)/layout.tsx` wraps every real page without affecting URLs:

- `/` → `app/(dashboard)/page.tsx` — dashboard home, leads with Revenue Agent CTA
- `/revenue-agent` → `app/(dashboard)/revenue-agent/page.tsx` — the primary product, 10-field brief form
- `/new-client` → `app/(dashboard)/new-client/page.tsx` — **legacy** agency intake (three-agent picker). Explicitly marked as legacy in the UI; candidate for deletion.

API routes (both call Anthropic):

- `app/api/run-revenue-agent/route.ts` — single call, one orchestrator system prompt that makes Claude internally reason through five specialist lenses (Revenue Strategist / Product / Organic Growth / Sales / Execution) and synthesize one 12-section deliverable.
- `app/api/run-agent/route.ts` — legacy. Branches on `serviceType` ("strategy" | "content" | "ads"), applies a per-agent persona, returns a 5-7 section deliverable.

## Claude API conventions (follow these for any new agent)

Both routes share the same shape — **keep new routes consistent**:

- **Model:** `claude-opus-4-7` (constant `MODEL` at top of route file).
- **Client:** lazy module-singleton — `let client: Anthropic | null = null; const getClient = () => (client ??= new Anthropic())`. Do not call `new Anthropic()` inside the request handler.
- **Thinking:** `thinking: { type: "adaptive" }`. No `budget_tokens` (removed on 4.7, returns 400).
- **No sampling params.** `temperature` / `top_p` / `top_k` are removed on Opus 4.7 — do not send them.
- **Effort:** `output_config.effort: "medium"` is the current default (balance of cost/quality). Bump to `"high"` or `"xhigh"` on Opus 4.7 if quality matters more than cost.
- **Structured outputs:** use `output_config.format: { type: "json_schema", schema: sectionsSchema }`. Schema must set `additionalProperties: false` on every object (Anthropic structured-outputs requirement).
- **Output shape:** every agent returns `{ businessName?/clientName?, sections: Array<{ title: string; body?: string; items?: string[] }> }`. The `ResultPanel` components on the pages render this exact shape; preserve it for any new agent.
- **User input goes in the `user` message**, never the `system` message (prompt-injection hygiene).
- **Error handling:** the route catches `Anthropic.AuthenticationError` → 401, `RateLimitError` → 429, `APIError` → passthrough status, generic Error → 500. Keep this ladder when adding routes.

## Frontend conventions

- All `(dashboard)/*` pages are client components (they have state, framer-motion, and forms). The layout is also a client component (uses `usePathname` for active-nav highlighting).
- Forms POST JSON to the matching API route; the client handles `res.ok`, JSON-validation, `error` state, and a red alert banner. The shape check is done on the client before `setResult`.
- `ResultPanel` is duplicated between `new-client/page.tsx` and `revenue-agent/page.tsx` — **do not extract to a shared component while `new-client` is still legacy and may be deleted**. Revisit after that decision.

## Environment

- `ANTHROPIC_API_KEY` must be set in `.env.local` at the project root. **Next.js only loads `.env.local` at dev-server startup** — restart after changing it.
- `.env.local` is `.env*`-ignored in `.gitignore`. Never commit it.
- API routes set `export const runtime = "nodejs"` — keep this, the Anthropic SDK is happiest on Node runtime.

## Deploy-time caveat

Both API endpoints are currently **unauthenticated**. This is fine locally, but anyone who discovers the endpoint on a public deployment can burn Anthropic credits. Before deploying publicly: gate with a shared-secret header, Vercel Deployment Protection, or proper auth (NextAuth / Clerk). Also set a monthly spend cap at https://console.anthropic.com/settings/limits.

## Design rules (from `project_constitution.md`)

- Mobile-first, premium feel, no boring plain sections.
- Strong spacing, clear hierarchy, clear CTA on every main page.
- Keep reusable components reusable. Separate UI from backend logic.
- Naming should be clean and predictable.

The existing visual language — glass cards (`border-white/10 bg-white/[0.03] backdrop-blur-xl`), violet/fuchsia/cyan gradient accents, `rounded-2xl`, staggered `framer-motion` entrance animations, `#0a0a10`/`#07070b` dark backgrounds — is the house style. Match it when adding new surfaces.
