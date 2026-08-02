/**
 * Long-form write-ups for the featured projects.
 *
 * Kept apart from `data.ts` because the shapes serve different pages: the
 * card data is a summary the home page reads in full, this is the detail only
 * `/work/[slug]` pulls in. Everything here describes what the repositories
 * actually do — the endpoint lists, the counts, the decisions and their
 * reasons are taken from the code and its documentation, not invented to
 * round out a page.
 */

export type Chapter = {
  title: string;
  body: string;
};

export type Decision = {
  choice: string;
  because: string;
};

export type ArchitectureLayer = {
  layer: string;
  detail: string;
};

export type CaseStudy = {
  /** The problem, stated the way the project's own README states it. */
  problem: string;
  /** Framing paragraphs, shown above the chapters. */
  context: string[];
  chapters: Chapter[];
  architecture: ArchitectureLayer[];
  decisions: Decision[];
  /** What is actually guarded by tests, and how. */
  verification: string;
  /** Callouts rendered as a spec strip. */
  facts: { label: string; value: string }[];
};

export const caseStudies: Record<string, CaseStudy> = {
  kasane: {
    problem:
      "Watching Japanese video to learn from it means choosing between subtitles you cannot interrogate and a dictionary you have to leave the video to use — and every hosted translator wants the footage on someone else's server.",
    context: [
      "Kasane is a self-hosted Japanese-to-English video translator. It takes local files or authorized YouTube links, publishes English subtitles while the video is still processing, and keeps every synchronized Japanese word clickable for readings, definitions, confidence and contextual examples.",
      "The entire translation path runs in containers the viewer controls. There is no hosted model API, no key to buy and no metered language service — which is the constraint the rest of the design follows from.",
    ],
    chapters: [
      {
        title: "Stay ahead of the viewer, then never stop",
        body: "The worker prepares the first twelve seconds before playback unlocks, then keeps working ahead of the playhead using bounded overlapping audio windows. Each window is transcribed, translated, enriched and pushed to the browser over a Server-Sent Events stream. After that one-time buffer, playback is never paused to let processing catch up — the buffer is the entire cost, paid once and visibly, with live seconds and progress rather than an indeterminate spinner.",
      },
      {
        title: "Words, not just subtitles",
        body: "Japanese does not put spaces between words, so a subtitle line is not something you can click. Fugashi with UniDic does morphological tokenization to recover word boundaries, and each token carries its word-level timestamp and recognition confidence through to the player. A locally indexed JMdict database supplies readings, Hepburn romanization, parts of speech and definitions; Tatoeba supplies contextual example sentences. The lexicon is pinned and built into the analyzer image, so lookups are a read-only SQLite query rather than a network call.",
      },
      {
        title: "Never do the same inference twice",
        body: "Public YouTube analyses are fingerprinted by video ID and inference profile. A completed result is reused for twenty-four hours, and concurrent requests for the same video are collapsed onto a single in-flight task rather than each starting their own. Tracking parameters on a URL do not create duplicate work. Uploaded files are deliberately excluded from that shared cache — private media should not become a cache entry someone else can hit.",
      },
      {
        title: "A dropped connection is not a lost job",
        body: "Redis holds the queue and durable job snapshots, so the SSE stream is an optimization rather than the source of truth. If a live connection breaks, the client falls back to adaptive polling against the snapshot and picks up where it was, instead of restarting inference that has already been paid for.",
      },
      {
        title: "One build, local or deployed",
        body: "Browser traffic never targets a machine-local analyzer address. Next.js proxies /api/analyzer/* to the internal analyzer service, so the same build works on a laptop and behind a production domain without a public analyzer URL or a second configuration path to keep in sync.",
      },
    ],
    architecture: [
      { layer: "Next.js studio", detail: "Player, live timeline, word inspector, SSE client." },
      { layer: "/api/analyzer gateway", detail: "Same-origin proxy to the internal service." },
      { layer: "FastAPI job service", detail: "Job submission, limits, cancellation, snapshots." },
      { layer: "Redis", detail: "Queue plus durable job state for recovery." },
      { layer: "Celery worker", detail: "yt-dlp and FFmpeg ingestion, inference, enrichment." },
      { layer: "faster-whisper", detail: "Japanese recognition and English translation." },
      { layer: "JMdict / UniDic", detail: "Read-only lexicon and morphological tokenizer." },
    ],
    decisions: [
      {
        choice: "Self-hosted inference instead of a translation API",
        because:
          "The premise is that the media stays private. A hosted API would mean uploading the footage, a key to manage and a per-minute cost that scales with exactly the usage the tool is designed to encourage.",
      },
      {
        choice: "A twelve-second buffer before playback unlocks",
        because:
          "Short enough to feel like a load, long enough that the worker can stay ahead for the rest of the video. Tuning the chunk duration trades initial wait against recognition context and CPU efficiency, and twelve seconds is where that balance landed.",
      },
      {
        choice: "SSE with a polling fallback, not WebSockets",
        because:
          "The stream is one-directional and the job state is already durable in Redis. SSE survives proxies that WebSocket upgrades do not, and the fallback path is a plain GET against the same snapshot.",
      },
      {
        choice: "Fingerprint by video ID and inference profile",
        because:
          "Two viewers asking for the same video at the same quality profile should cost one inference run. Including the profile in the key stops a CPU-profile result being served to someone who asked for the GPU one.",
      },
      {
        choice: "Proxy the analyzer through Next.js",
        because:
          "It keeps the analyzer off the public internet and makes the browser's URL identical in development and production, so there is no environment-specific client configuration to get wrong.",
      },
    ],
    verification:
      "Ingestion is bounded before it reaches the worker: streamed uploads with duration and size limits, rate limiting, cancellation, and errors that stay safe to show a user. YouTube handling is scoped to material the operator is authorized to process, and playback stays in the official embedded player — the worker uses the link only for audio analysis.",
    facts: [
      { label: "First playback", value: "12 s" },
      { label: "Result reuse", value: "24 h" },
      { label: "Hosted APIs", value: "0" },
      { label: "Services", value: "5" },
    ],
  },
  "neural-rig": {
    problem:
      "The stock Neural Amp Modeler plugin loads one capture at a time, and finding a new one means leaving the DAW to go browsing — so the two things a player actually does, chaining tones and hunting for them, both sit outside the tool.",
    context: [
      "NeuralRig is a guitar amp plugin built on Neural Amp Modeler. Where the stock plugin is a single capture, NeuralRig is a rig: a chain of NAM captures, plus a TONE3000 browser built into the plugin itself, so profiles can be searched, filtered, downloaded and auditioned without switching windows.",
      "It ships as VST3, AU, AAX and Standalone, and is derived directly from NeuralAmpModelerPlugin — which sets the constraint the whole project is judged against.",
    ],
    chapters: [
      {
        title: "Tone parity is the acceptance test",
        body: "A single loaded capture has to sound exactly as it does in the original plugin, or the extra features are worthless. The signal path is kept intact end to end: calibrated input trim, noise gate trigger, the NAM capture resampled to its trained rate, gate gain, tone stack, impulse response, DC-blocking high-pass, output trim. Anything added sits around that chain rather than inside it.",
      },
      {
        title: "A noise gate split across the model",
        body: "The gate triggers on the input, so the decision to open is made on the player's clean signal — but it applies its gain after the model, so the capture's own noise floor is attenuated too. Both simpler arrangements are worse in specific ways: gating entirely before the model leaves that noise floor untouched, and gating entirely after it makes the gate stutter on the model's output rather than on what was played.",
      },
      {
        title: "The high-pass that isn't cosmetic",
        body: "Neural models can emit a small DC offset. The DC-blocking high-pass after the impulse response looks like tidy-up and is actually load-bearing: without it, that offset accumulates through everything downstream. It is the kind of stage that is easy to drop during a refactor because removing it changes nothing audible immediately.",
      },
      {
        title: "One precision, all the way through",
        body: "Everything runs in double, matching iPlug2's sample type and the defaults of both NAM_SAMPLE and DSP_SAMPLE. Mixed precision across a chain this long is a silent problem — no stage errors, the result is just quietly worse than it should be.",
      },
      {
        title: "A layout dictated by the build",
        body: "The repository mirrors upstream's structure because iPlug2's project files reference dependencies by relative path and will not resolve otherwise. iPlug2, NeuralAmpModelerCore, AudioDSPTools and Eigen come in as submodules; the plugin itself is the only original tree. Linux is unsupported, which is the trade iPlug2 makes for a permissive licence and upstream parity.",
      },
    ],
    architecture: [
      { layer: "iPlug2", detail: "Plugin framework and formats (submodule)." },
      { layer: "NeuralAmpModelerCore", detail: "NAM inference engine (submodule)." },
      { layer: "AudioDSPTools", detail: "Gate, IR, filters, resampler (submodule)." },
      { layer: "Eigen", detail: "Linear algebra behind the model (submodule)." },
      { layer: "NeuralRig", detail: "Processor, editor, rig chain, TONE3000 browser." },
    ],
    decisions: [
      {
        choice: "Derive from NeuralAmpModelerPlugin rather than rebuild",
        because:
          "Parity with the reference implementation is the product requirement. Reimplementing the chain would mean re-earning a tone people already trust, and every difference would read as a bug.",
      },
      {
        choice: "Trigger the gate before the model, apply it after",
        because:
          "It is the only arrangement where the open/close decision is made on the player's signal and the capture's noise floor still gets attenuated. Both single-sided placements fail one of those.",
      },
      {
        choice: "Ship the profile browser inside the plugin",
        because:
          "Auditioning a tone means hearing it in the current mix. A browser in a separate app turns that into download, install, reload, listen — which is enough friction that people stop exploring.",
      },
      {
        choice: "Accept no Linux support",
        because:
          "iPlug2 does not target it. Swapping frameworks to gain Linux would cost the permissive licence and the upstream parity the project is built on.",
      },
    ],
    verification:
      "The reference build is the test: a single capture through NeuralRig has to match the same capture through NeuralAmpModelerPlugin. Distribution is scripted per platform, so what gets shipped is what was built rather than an IDE's local state.",
    facts: [
      { label: "Formats", value: "VST3 / AU / AAX / Standalone" },
      { label: "Chain stages", value: "8" },
      { label: "Sample type", value: "double" },
      { label: "Submodules", value: "4" },
    ],
  },
  spillsense: {
    problem:
      "Spill response programs live or die on data quality: a responder needs to know what spilled, where, how much, and who is responsible — fast.",
    context: [
      "SpillSense models the data systems behind Washington State's oil-spill prevention, preparedness and response programs. It is a full vertical slice: structured incident records with spatial coordinates, a validated ETL intake pipeline, a filterable REST API, an interactive GIS dashboard, and reporting and export tooling for program analysts.",
      "The domain model follows how environmental agencies actually classify a spill — medium affected, substance category, source type, response status, and Department of Ecology regional jurisdiction — rather than a generic incident table with a free-text notes column.",
    ],
    chapters: [
      {
        title: "Integrity lives in the database",
        body: "All 39 Washington counties are seeded with FIPS codes, Ecology region assignments and coastal flags, and coordinate sanity bounds catch swapped or malformed latitude/longitude at intake. Report numbers are unique natural keys, deletes on reference data are restricted, and enums are stored as strings so the database stays self-describing for anyone writing reports against it directly. Indexes are matched to the query paths the dashboard actually takes, not sprinkled over every column.",
      },
      {
        title: "Imports that can be re-run and audited",
        body: "Every import is recorded as an ImportRun with insert, update, unchanged and rejected counts. Re-running the same file inserts nothing new and updates changed rows in place, matched on report number, so an import that half-finished can simply be run again. Rows that fail validation are quarantined with the raw line preserved verbatim alongside every reason it failed — a row is never silently dropped.",
      },
      {
        title: "Report every problem, not the first one",
        body: "Validation catches malformed report numbers, unparseable or future dates, out-of-state or swapped coordinates, unknown counties, negative quantities, unrecognised classifications and in-file duplicates — and reports all of a row's problems at once. Filter parameters bind as strings on purpose so the parser can name every invalid value in one response rather than failing on the first with a framework binding error. Bad input comes back as RFC 9457 problem details listing the accepted values.",
      },
      {
        title: "One filter set, every panel",
        body: "Search, county, region, medium, substance, source, status, date range, minimum volume and a bounding-box spatial filter combine with AND, and the same filter set drives the list endpoint, the RFC 7946 GeoJSON feed and the statistics endpoints. Because the filters are composable and shared, the map, the charts, the KPI tiles and the table cannot disagree with each other. Filter state lives in the querystring, so any view of the data is a permalink.",
      },
      {
        title: "Two hosts, one contract",
        body: "The ASP.NET Core host owns the database, the intake pipeline and the interactive API docs. Vercel runs a read-only replica: Node serverless functions implementing the same contract against a published snapshot exported from the system of record. The dashboard is host-agnostic — it calls the same endpoints either way — and contract tests run against the serverless layer so the two deployments cannot drift apart.",
      },
    ],
    architecture: [
      {
        layer: "SpillSense.Domain",
        detail: "Entities, enums and geography rules. No dependencies.",
      },
      {
        layer: "SpillSense.Infrastructure",
        detail: "EF Core context, configurations, migrations, ETL pipeline.",
      },
      {
        layer: "SpillSense.Web",
        detail: "ASP.NET Core host — REST API plus the dashboard.",
      },
      {
        layer: "api/",
        detail: "Vercel serverless functions serving the same contract.",
      },
      {
        layer: "tests/",
        detail: ".NET integration tests plus node:test API contract tests.",
      },
    ],
    decisions: [
      {
        choice: "SQLite as the default provider",
        because:
          "The project runs anywhere with zero setup, and the EF model is kept provider-portable — pointing the connection string at SQL Server is a drop-in swap, which mirrors the deployment target an agency would actually have.",
      },
      {
        choice: "Enums stored as strings",
        because:
          "A report writer querying the database directly sees 'Diesel', not 3. The database explains itself without a lookup table or a copy of the C# enum.",
      },
      {
        choice: "A dependency-light dashboard",
        because:
          "Vanilla ES modules with Leaflet and Chart.js, no build step. The dashboard is the part an analyst has to trust; keeping it inspectable was worth more than a framework.",
      },
      {
        choice: "Scalar vendored, not loaded from a CDN",
        because:
          "The API reference and explorer both work offline, which matters for a tool that might be opened somewhere with no connectivity.",
      },
    ],
    verification:
      "Integration tests run against real migrations rather than an in-memory fake, so schema changes are exercised the way they will actually be applied. A separate node:test contract suite runs against the serverless layer in CI, which is what keeps the two hosts honest.",
    facts: [
      { label: "API endpoints", value: "12" },
      { label: "Counties seeded", value: "39" },
      { label: "Error format", value: "RFC 9457" },
      { label: "Map feed", value: "RFC 7946" },
    ],
  },

  "tokyo-train-map": {
    problem:
      "A rail map has to answer two different questions — what the network is, and how to get across it — and flat diagrams usually only answer the first.",
    context: [
      "Neo Tokyo Transit is a fully explorable 3D map of Tokyo's rail and subway network that doubles as a working journey planner. It covers JR, Tokyo Metro, Toei, Yurikamome and Rinkai — every Metro and Toei line complete to its true termini, including the Marunouchi Honancho and Oedo Hikarigaoka branches.",
      "The dataset is hand-curated rather than pulled from a live feed, which is what makes the termini and the transfer detail complete enough to route on.",
    ],
    chapters: [
      {
        title: "Real coordinates, real depths",
        body: "269 stations carry authentic WGS 84 coordinates and bilingual names, projected into the scene at 55 metres per world unit. The network is layered vertically the way the real one is: elevated JR and Yurikamome viaducts sit above the ground grid, and each subway line sits at its own stacked depth, with the Oedo line deepest — as it is in life. Neon data pillars rise through interchanges to connect the underground and surface layers.",
      },
      {
        title: "Routing over a station-by-line graph",
        body: "Pathfinding runs Dijkstra over a graph whose nodes are (station × line) pairs rather than stations. That is the decision the whole route planner rests on: modelling a transfer as an edge between two nodes at the same station makes a change of line an explicit, weightable event, so transfer penalties and designated out-of-station walking transfers — Otemachi to Tokyo, Hibiya to Yurakucho, Hamamatsucho to Daimon — fall out of the graph instead of being special-cased afterwards.",
      },
      {
        title: "Wayfinding, not just a line list",
        body: "Every transfer surfaces the optimal passage or exit, including cross-platform interchanges like Omotesando G⇄Z and Akasaka-Mitsuke G⇄M. Walking transfers give exit-to-exit street directions and destinations list their notable exits. Results show total time, transfer count, per-leg line badges and a stop-by-stop breakdown, and the 3D scene dims to the route with energy-flow tubes and pulsing origin and destination markers.",
      },
      {
        title: "Finding a station in two languages",
        body: "Search matches romaji or Japanese with fuzzy tolerance and full keyboard navigation, so the map is usable whether you know a station as 秋葉原 or Akihabara.",
      },
    ],
    architecture: [
      { layer: "lib/data", detail: "The curated network: stations and lines." },
      { layer: "lib/geo.ts", detail: "WGS 84 → scene projection, 55 m per unit." },
      { layer: "lib/graph.ts", detail: "Routing graph and Dijkstra with penalties." },
      { layer: "lib/search.ts", detail: "Bilingual fuzzy station search." },
      { layer: "components/scene", detail: "Network tubes, trains, route highlight, post-processing." },
    ],
    decisions: [
      {
        choice: "Nodes are (station × line), not station",
        because:
          "A transfer becomes an edge you can price. Modelling stations as single nodes would make every interchange free and every route wrong.",
      },
      {
        choice: "A curated dataset rather than a live API",
        because:
          "No upstream dependency to break, and the branches and termini a live feed tends to truncate are complete. The tradeoff is that the data is a snapshot, which is the right trade for a map of infrastructure that changes on a scale of years.",
      },
      {
        choice: "Static export",
        because:
          "The whole thing is a client-side scene over a fixed dataset — there is no server left to justify.",
      },
    ],
    verification:
      "Vitest covers the three things that break silently when data drifts: dataset integrity, the geographic projection, and routing invariants. A wrong coordinate or a mislabelled interchange shows up as a failing test rather than a subtly bad route.",
    facts: [
      { label: "Stations", value: "269" },
      { label: "Rail lines", value: "22" },
      { label: "Scene scale", value: "55 m / unit" },
      { label: "Languages", value: "EN / 日本語" },
    ],
  },

  apartmentfeesjapan: {
    problem:
      "Japanese leases front-load four and a half to six months of rent before you get the keys, spread across fees that are never quoted together.",
    context: [
      "Deposit (敷金), key money (礼金), agency fee (仲介手数料), guarantor company (保証会社), fire insurance, lock exchange and rent paid in advance — the calculator models the full 初期費用 stack with the rules that actually govern it, including the legal cap on agency fees plus consumption tax, prorated 日割り rent, and guarantor rates.",
      "It is written for people moving to Japan from abroad, so it is bilingual by construction rather than by translation pass.",
    ],
    chapters: [
      {
        title: "Every line item explains itself",
        body: "Each fee says what it is, whether the money ever comes back, and how negotiable it is — plus a 'negotiated well' scenario showing what the same lease costs if you push on the items that move. The point is not the total; it is understanding which parts of the total are actually fixed.",
      },
      {
        title: "A ward map with no map library",
        body: "The 23-ward choropleth is built from government boundary data, simplified at build time from GeoJSON into roughly 28 KB of precomputed SVG paths. That replaced shipping a mapping library and a GeoJSON payload to the client entirely. Clicking a ward loads its market average into the calculator, with notes on the ward's character and train access.",
      },
      {
        title: "A pipeline that heals itself",
        body: "Studio averages are fetched once a day from SUUMO's public market-rate page — Japan's largest listing site — and cross-checked against LIFULL HOME'S, falling back to a calibrated baseline dataset when a source is unavailable. Next's daily ISR revalidation means upstream sites are hit at most once per day no matter how much traffic arrives, and the raw data is exposed at /api/rates rather than hidden inside the app.",
      },
      {
        title: "Bilingual all the way down",
        body: "Every UI string, fee explanation, negotiation tip and ward guide is written natively in English and Japanese. The choice persists and auto-detects Japanese browsers. 23 statically generated ward guide pages carry rent tables, rankings and example breakdowns, refreshed daily by the same pipeline.",
      },
    ],
    architecture: [
      { layer: "Calculator", detail: "The fee stack, its rules and negotiation scenarios." },
      { layer: "Ward map", detail: "Build-time GeoJSON → ~28 KB of SVG paths." },
      { layer: "Rates pipeline", detail: "Two sources, cross-validated, daily ISR." },
      { layer: "/wards/[ward]", detail: "23 statically generated guide pages." },
      { layer: "/api/rates", detail: "The underlying data, exposed rather than hidden." },
    ],
    decisions: [
      {
        choice: "Precompute the map at build time",
        because:
          "A choropleth of 23 fixed polygons does not need a runtime mapping library. Simplifying to SVG paths at build removed the dependency and the payload in one move.",
      },
      {
        choice: "Cross-validate two sources with a calibrated fallback",
        because:
          "Scraped market rates are the least trustworthy input in the system. Two independent sources plus a known-good baseline means a bad scrape degrades the numbers instead of breaking the page.",
      },
      {
        choice: "Daily ISR rather than per-request fetching",
        because:
          "The data changes daily at most, and being a polite consumer of someone else's public page is part of the design.",
      },
    ],
    verification:
      "The rates pipeline validates each source against the other and against a calibrated baseline before anything is served, so the failure mode is a stale-but-correct number rather than a wrong one.",
    facts: [
      { label: "Wards mapped", value: "23" },
      { label: "Map payload", value: "~28 KB" },
      { label: "Upstream hits", value: "1 / day" },
      { label: "Languages", value: "EN / 日本語" },
    ],
  },

  "chord-finder": {
    problem:
      "Music analysis tools want your audio on their servers. Everything needed to do the analysis already exists in the browser.",
    context: [
      "ChordLab analyses a song — or a live microphone — entirely client-side: chord recognition, key detection, guitar tablature, MIDI export and Roman-numeral analysis, with no upload and no server.",
      "The whole signal chain is written from scratch in TypeScript with zero runtime dependencies: FFT, chromagram, onset detection, pitch estimation, Viterbi decoding and a MIDI writer.",
    ],
    chapters: [
      {
        title: "Chromagram",
        body: "Audio is decoded and resampled to 22.05 kHz, then analysed in Hann-windowed 8192-sample frames. Spectral peaks are refined with parabolic interpolation and a global tuning offset is estimated from the circular mean of cent deviations, so a recording that sits between concert pitches still resolves. Peaks map onto a 12-bin pitch-class profile with square-root magnitude compression.",
      },
      {
        title: "Chords, smoothed rather than filtered",
        body: "Each frame is scored against harmonic-aware chord templates — instrument overtones are modelled in the template, which keeps the chromagram itself sharp instead of blurring it to compensate. A Viterbi pass with sharpened emissions removes flicker while still catching quick changes, and segments under 300 ms are absorbed. The result reads like a chart rather than a per-frame argument: 145 states, 12 qualities × 12 roots plus no-chord.",
      },
      {
        title: "Key and transcription",
        body: "Key comes from correlating the energy-weighted aggregate chroma against the 24 rotated Krumhansl-Kessler major and minor profiles, reported with a certainty and the correct flat or sharp spelling. Onsets come from spectral flux with an adaptive threshold and a global significance gate; tempo from autocorrelation of the flux envelope. Each inter-onset segment goes through iterative harmonic-salience pitch estimation with spectral subtraction, up to six simultaneous notes, with sub-octave ghost suppression.",
      },
      {
        title: "Tabs a hand can actually play",
        body: "Notes are grouped into columns, with strums chain-grouped automatically, then assigned string and fret positions by exhaustive search minimising hand position, stretch and movement between shapes. Measures follow the estimated tempo and the chord analysis labels the staff; the tab is downloadable as plain text and the transcription exports as format-1 MIDI with tempo, time-signature and key-signature metadata.",
      },
    ],
    architecture: [
      { layer: "src/lib/dsp", detail: "FFT, windowing, chromagram, tuning estimation." },
      { layer: "src/lib/chords", detail: "Templates, Viterbi decoding, segmentation." },
      { layer: "src/lib/theory", detail: "Key profiles, spelling, Roman-numeral analysis." },
      { layer: "src/lib/tab", detail: "Fingering search and text tab rendering." },
      { layer: "Web Worker", detail: "The entire engine, off the main thread." },
    ],
    decisions: [
      {
        choice: "Zero runtime dependencies",
        because:
          "Every stage is understood and tunable. A DSP library would have made the tuning-offset estimation and the harmonic-aware templates someone else's parameters.",
      },
      {
        choice: "Model overtones in the templates, not the chroma",
        because:
          "Smearing the chromagram to account for harmonics costs resolution everywhere. Putting the harmonic model in the template keeps the observation sharp and the correction local.",
      },
      {
        choice: "Viterbi over per-frame argmax",
        because:
          "Frame-by-frame classification flickers between relative chords. A decoder with transition costs produces a timeline a musician can read.",
      },
      {
        choice: "Everything in a Web Worker",
        because:
          "The main thread stays responsive during analysis, and the audio never leaves the machine — which is the whole premise.",
      },
    ],
    verification:
      "A Vitest suite covers the DSP and music-theory layers — the parts where a subtle error produces plausible-looking output rather than an obvious failure.",
    facts: [
      { label: "Chord states", value: "145" },
      { label: "Key profiles", value: "24" },
      { label: "Frame size", value: "8192" },
      { label: "Runtime deps", value: "0" },
    ],
  },
};
