# Portfolio — Jonathan Cho

[![CI](https://github.com/jon-jc/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/jon-jc/portfolio/actions/workflows/ci.yml)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000)
![React 19](https://img.shields.io/badge/React-19-149ECA)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)

Portfolio and resume site for a software engineer working across React, TypeScript, .NET and relational data systems. Built with the Next.js App Router, React Server Components, Tailwind CSS v4 and Motion.

**Live:** [jon-jc.vercel.app](https://jon-jc.vercel.app)

---

## What's in it

| Route | What it is |
| --- | --- |
| `/` | Single-page composition: work, experience, about, lab, stack, contact |
| `/work/[slug]` | Long-form case study per featured project, statically generated |
| `/resume` | The resume as a page, with a print stylesheet that produces a clean PDF |
| `/opengraph-image` | Social card, generated at build time |
| `/work/[slug]/opengraph-image` | Per-project social card |
| `/sitemap.xml`, `/robots.txt` | Generated from the same content the pages read |

Every route above is prerendered. There is no client-side data fetching and no runtime API.

## Architecture

```
src/
  app/                     App Router: routes, metadata, OG image generation
    work/[slug]/           Case study route + its OG card
    resume/                Print-oriented resume route
  components/
    layout/                Nav, SubNav, Footer
    sections/              Hero, Work, Experience, About, Lab, Stack, Contact
    ui/                    Interaction primitives (see below)
    visuals/               Hand-drawn SVG project posters
    seo/                   JSON-LD graph
  lib/
    site.ts                Identity, links, nav order — single source of truth
    data.ts                Projects, experience, education, skills
    case-studies.ts        Long-form write-ups for /work/[slug]
    hooks.ts               Media queries, active section, theme, scroll lock
    utils.ts               cn, clamp, progress, fuzzy matching
```

### Content is data, not markup

`src/lib` holds every fact the site states. The home page, the case studies, the resume, the sitemap, the JSON-LD graph and the OG images all read from it, so a project's live URL exists in exactly one place. Adding a project means adding an entry and a case study; the route, the social card and the sitemap follow automatically.

Content invariants are tested rather than assumed — that every featured project resolves a case study, that the metric arrays are the length the layout expects, that a project without a public repository explains why.

### Design system

Two themes share one variable contract in `globals.css`. Components read semantic tokens (`canvas`, `surface`, `ink`, `line`, `accent`) and never a raw colour, so flipping `data-theme` on `<html>` restyles the site. The theme resolves in an inline script before first paint, so there is no flash of the wrong palette, and `useTheme` subscribes to the attribute through a `MutationObserver` so every consumer stays in sync no matter what changed it.

Type is three faces with three jobs: Instrument Sans for interface and body, Fraunces for display, JetBrains Mono for data and labels.

### Interaction primitives

- **Cursor** — dot that tracks exactly, spring-lagged ring, and a label pill offset like a tooltip so it never covers what it describes. The dot is `mix-blend-difference`, so it inverts its background instead of needing theme logic.
- **CommandPalette** — ⌘K over sections, projects, links and actions, with subsequence fuzzy matching that rewards word-boundary hits.
- **SpotlightCard** — pointer-lit border and interior driven by CSS custom properties, so it costs zero React renders per frame.
- **Reveal / RevealGroup** — scroll entrances that displace and blur rather than plain-fade.
- **Magnetic**, **Marquee**, **TextScramble**, **RotatingText**, **ScrollProgress**, **Grain**.

### Project posters

Each featured project gets a drawn SVG rather than a screenshot — a clustered incident map, a layered rail graph, a ward choropleth, a chromagram, a translation stack. A dashboard screenshot at card size is unreadable; a diagram of what the system *is* survives being small.

They are generated from a seeded PRNG, so server and client produce byte-identical markup and there is nothing for hydration to disagree about. A test asserts exactly that, because the production symptom of breaking it is a hydration mismatch on every card.

## Accessibility and motion

- Every decorative animation is gated on `prefers-reduced-motion`, in CSS wholesale and again in JS for motion the stylesheet can't reach.
- The custom cursor renders only for fine pointers with motion enabled; everything else keeps the native cursor.
- Skip link, visible focus rings, labelled controls, `aria-current` on the active section, focus restoration when the palette and mobile menu close, and scroll lock that compensates for the scrollbar so the page doesn't shift.
- Posters are `aria-hidden`; company logos are decorative because the company name sits beside them.

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Testing

Vitest, in a Node environment, covering the parts where a mistake is silent rather than loud:

- **Content invariants** — case study coverage, no orphaned studies, metric counts the layout depends on, https links, decisions that carry a reason.
- **Poster determinism** — two independent renders of every poster produce identical markup, with no `NaN` coordinates and no floats long enough for server and client formatting to diverge.
- **Utilities** — fuzzy matching order and scoring, clamping, progress.

## CI/CD

GitHub Actions runs lint → test → build → typecheck on every push to `main` and every pull request, with concurrency cancellation so superseded runs stop early. Typecheck runs after the build because Next generates route types into `.next/types` that `tsconfig.json` pulls into the program. Build diagnostics upload as an artifact on failure.

Deployment is Vercel, on push to `main`.

## Licence

Source is MIT. The written content, resume, project descriptions and company logos are not — please don't republish them as your own.
