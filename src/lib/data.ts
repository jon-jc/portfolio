/**
 * Portfolio content.
 *
 * Everything here is drawn from the résumé and the project repositories —
 * metrics are the real numbers from each codebase, not decoration. Live URLs
 * were verified reachable before being listed; anything without a working
 * deployment links to source only.
 */

export type Accent = "accent" | "iris" | "flare";

export type Metric = {
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  /** Short pitch — one sentence, used on the card face. */
  summary: string;
  /** The engineering story, 2–3 beats. Shown when a card is expanded. */
  highlights: string[];
  metrics: Metric[];
  stack: string[];
  live?: string;
  repo: string;
  accent: Accent;
};

export const featuredProjects: Project[] = [
  {
    slug: "spillsense",
    name: "SpillSense",
    tagline: "Environmental incident platform",
    year: "2026",
    summary:
      "An incident data-management and analytics platform for Washington State spill response — validated ETL intake, relational schema, REST API, and a GIS dashboard, built end to end.",
    highlights: [
      "Enforced integrity at the database level with natural keys, restricted deletes and query-path indexes, and made imports idempotent — every run writes an audit record and quarantines rejects with the reason they failed.",
      "Exposed the data through an OpenAPI-documented REST API whose composable filters are shared across the list, GeoJSON and statistics endpoints, so every filter drives every panel.",
      "Backed by integration tests that run against real migrations plus contract tests in CI, with a serverless read-only replica on Vercel serving a published snapshot.",
    ],
    metrics: [
      { value: "10", label: "API endpoints" },
      { value: "39", label: "counties seeded" },
      { value: "100%", label: "rejects auditable" },
    ],
    stack: [
      "C#",
      ".NET 10",
      "ASP.NET Core",
      "EF Core",
      "SQL Server",
      "Leaflet",
      "OpenAPI",
    ],
    live: "https://spillsense.vercel.app",
    repo: "https://github.com/jon-jc/spillsense",
    accent: "accent",
  },
  {
    slug: "tokyo-train-map",
    name: "Neo Tokyo Transit",
    tagline: "3D rail network & route planner",
    year: "2026",
    summary:
      "An explorable 3D map of Tokyo's rail network built from real geographic coordinates, with trains animated against schedule data and a Dijkstra route planner underneath.",
    highlights: [
      "Modelled 22 lines and 269 stations from authentic coordinates, layered vertically so elevated rail and subway sit at their real relative depths.",
      "Implemented Dijkstra pathfinding over a station-by-line graph with transfer penalties and documented out-of-station walking transfers, surfacing exit-level wayfinding for each change.",
      "Verified by tests covering dataset integrity, map projection and routing invariants — the guarantees that break silently if the data drifts.",
    ],
    metrics: [
      { value: "269", label: "stations" },
      { value: "22", label: "rail lines" },
      { value: "2", label: "languages searchable" },
    ],
    stack: [
      "TypeScript",
      "Next.js 15",
      "React 19",
      "Three.js",
      "R3F",
      "Zustand",
      "Vitest",
    ],
    live: "https://tokyo-train-map.vercel.app",
    repo: "https://github.com/jon-jc/tokyo-train-map",
    accent: "iris",
  },
  {
    slug: "apartmentfeesjapan",
    name: "Tokyo Move-in Cost Calculator",
    tagline: "Bilingual lease cost simulator",
    year: "2026",
    summary:
      "A bilingual simulator for the Japanese lease fee stack — deposit, key money, agency, guarantor, insurance and prorated rent — over a self-healing daily data pipeline.",
    highlights: [
      "Modelled the complete fee stack with negotiation scenarios, so a renter can see what 4.5–6 months of upfront cost is actually made of before signing.",
      "Compiled government boundary data into a 28 KB precomputed SVG ward map at build time, dropping the map library entirely rather than shipping a GeoJSON payload to the client.",
      "Daily market rates from two sources are cross-validated and served through ISR, keeping upstream requests to once a day while 23 ward guides stay current.",
    ],
    metrics: [
      { value: "23", label: "wards mapped" },
      { value: "28 KB", label: "map payload" },
      { value: "2×", label: "sources cross-checked" },
    ],
    stack: ["TypeScript", "Next.js", "Tailwind CSS", "ISR", "i18n", "GeoJSON"],
    live: "https://apartmentfeesjapan.vercel.app",
    repo: "https://github.com/jon-jc/apartmentfeesjapan",
    accent: "flare",
  },
  {
    slug: "chord-finder",
    name: "ChordLab",
    tagline: "Client-side music analysis",
    year: "2026",
    summary:
      "A browser music-analysis tool that detects chords, keys, guitar tabs and MIDI from audio or a live mic — on a dependency-free DSP engine that never uploads a byte.",
    highlights: [
      "Wrote the signal chain from scratch in TypeScript — FFT, chromagram, spectral-flux onset detection, pitch estimation, Viterbi decoding and a MIDI writer — with no runtime dependencies.",
      "Recognises 145 chord states (12 qualities × 12 roots, plus no-chord) across 24 major/minor key profiles, smoothed by a Viterbi decoder so the timeline reads cleanly instead of flickering.",
      "Runs the whole engine in a Web Worker at 22.05 kHz with 8192-sample frames, keeping the main thread free and the audio on the user's machine.",
    ],
    metrics: [
      { value: "145", label: "chord states" },
      { value: "0", label: "runtime deps" },
      { value: "8192", label: "sample frames" },
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "Web Audio API",
      "Web Workers",
      "DSP",
      "Vitest",
    ],
    live: "https://chord-finder-ten.vercel.app",
    repo: "https://github.com/jon-jc/chord-finder",
    accent: "accent",
  },
];

export type SideProject = {
  name: string;
  blurb: string;
  stack: string;
  live?: string;
  repo: string;
};

export const sideProjects: SideProject[] = [
  {
    name: "Neural Rig",
    blurb:
      "Chainable Neural Amp Modeler rig with a built-in TONE3000 profile browser, shipping as VST3, AU and standalone.",
    stack: "C++ · JUCE · DSP",
    repo: "https://github.com/jon-jc/neural-rig",
  },
  {
    name: "Avant Garde",
    blurb:
      "Fashion e-commerce storefront built on the Next.js App Router with a component system on shadcn/ui.",
    stack: "TypeScript · Next.js · shadcn/ui",
    live: "https://fashion-khaki.vercel.app",
    repo: "https://github.com/jon-jc/fashion",
  },
  {
    name: "Academia",
    blurb:
      "Front-end redesign of a PDF analysis tool, rebuilt for responsiveness and a clearer reading experience.",
    stack: "TypeScript · React · Tailwind",
    live: "https://academia-navy-three.vercel.app",
    repo: "https://github.com/jon-jc/pdfAnalyzer",
  },
  {
    name: "LingoRooms",
    blurb:
      "Real-time language exchange rooms pairing learners by target language and level.",
    stack: "TypeScript · Next.js",
    repo: "https://github.com/jon-jc/language-rooms",
  },
  {
    name: "Souls-like Platformer",
    blurb:
      "2D souls-like with stamina-gated combat and checkpoint recovery, built in Godot.",
    stack: "GDScript · C# · Godot",
    repo: "https://github.com/jon-jc/soulslikeplatformer-godot",
  },
  {
    name: "Horror Pygame",
    blurb:
      "First-person horror game with line-of-sight enemy AI and a hand-rolled render loop.",
    stack: "Python · Pygame",
    repo: "https://github.com/jon-jc/horror-pygame",
  },
];

export type Logo = {
  src: string;
  width: number;
  height: number;
  /**
   * True for single-colour black marks, which vanish on the dark canvas and
   * are inverted by CSS instead of being shipped twice.
   */
  invertOnDark?: boolean;
};

export type Role = {
  company: string;
  title: string;
  mode: string;
  period: string;
  start: string;
  end: string;
  logo: Logo;
  bullets: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    company: "Patchapon LLC",
    title: "Software Engineer",
    mode: "Hybrid",
    period: "2023 — 2025",
    start: "2023",
    end: "2025",
    logo: { src: "/logos/patchapon.png", width: 363, height: 160 },
    bullets: [
      "Led development of a full-stack e-commerce platform, designing and building the customer-facing storefront in React and Next.js from the ground up.",
      "Built an internal analytics dashboard surfacing sales, revenue, customer trends and order performance, giving stakeholders a single view to drive marketing, inventory and product-launch decisions.",
      "Improved conversion through UI/UX work on the purchasing flow, and maintained a reliable storefront supporting day-to-day sales operations.",
    ],
    tags: ["React", "Next.js", "Analytics", "UI/UX"],
  },
  {
    company: "NightParade LLC",
    title: "Software Engineer",
    mode: "Remote",
    period: "2022 — 2023",
    start: "2022",
    end: "2023",
    logo: {
      src: "/logos/nightparade.png",
      width: 623,
      height: 160,
      invertOnDark: true,
    },
    bullets: [
      "Delivered a production e-commerce platform in React and Next.js with Shopify API integration for product management and secure checkout, contributing to a 55% increase in sales through improved user experience, site performance and a streamlined purchasing flow.",
      "Designed and built an internal sales analytics dashboard surfacing accurate real-time sales, order and revenue metrics, giving stakeholders actionable insight into business performance.",
    ],
    tags: ["React", "Next.js", "Shopify API", "Dashboards"],
  },
];

export const education = {
  degree: "B.A., Computer Science & Systems",
  school: "University of Washington",
  period: "Aug 2020 — Aug 2023",
  gpa: "3.67",
  coursework: [
    "Database Systems Design",
    "Data Structures",
    "Algorithms",
    "Operating Systems",
  ],
  extra: "Officer, HuSCII Coding Club",
};

export type SkillGroup = {
  title: string;
  hint: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    hint: "Daily drivers first",
    items: ["TypeScript", "JavaScript", "SQL", "C#", "Python", "Java", "C", "C++"],
  },
  {
    title: "Front End",
    hint: "Interfaces and rendering",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Three.js",
      "Web Audio API",
      "Web Workers",
    ],
  },
  {
    title: "Backend & Data",
    hint: "Schema through API",
    items: [
      "ASP.NET Core",
      ".NET",
      "Node.js",
      "EF Core",
      "Prisma",
      "PostgreSQL",
      "SQL Server",
      "SQLite",
      "MySQL",
      "MongoDB",
      "Schema design",
      "ETL pipelines",
      "REST / OpenAPI",
    ],
  },
  {
    title: "Delivery",
    hint: "Getting it to production",
    items: [
      "Docker",
      "AWS",
      "Vercel",
      "GitHub Actions",
      "Git",
      "Vitest",
      "Integration testing",
      "Contract testing",
      "Code review",
      "Agile delivery",
    ],
  },
];

/** Headline numbers for the hero strip. */
export const stats: Metric[] = [
  { value: "3+", label: "Years shipping production React" },
  { value: "55%", label: "Sales lift from purchase-flow rework" },
  { value: "4", label: "Systems built end to end, live now" },
];
