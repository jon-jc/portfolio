import type { Accent } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Abstract posters, one per project.
 *
 * These are drawn rather than screenshotted on purpose. A screenshot of a
 * dashboard at card size is unreadable mush; a diagram of what the system
 * *is* — a clustered incident map, a layered rail graph, a ward choropleth, a
 * chromagram — survives being small and says something about the shape of the
 * problem.
 *
 * Everything is deterministic: the same seeded generator runs on the server
 * and the client, so there is nothing for hydration to disagree about, and
 * coordinates are rounded to two decimals so the emitted markup is identical
 * on both sides.
 */

const tones: Record<Accent, string> = {
  accent: "var(--accent)",
  iris: "var(--iris)",
  flare: "var(--flare)",
};

/** mulberry32 — small, fast, and stable across runtimes. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Number(n.toFixed(2));

const VIEW = { w: 400, h: 260 } as const;

type PosterProps = {
  slug: string;
  tone?: Accent;
  className?: string;
};

/** Hairline graticule shared by the map-flavoured posters. */
function Graticule({ step = 32 }: { step?: number }) {
  const columns = Math.ceil(VIEW.w / step);
  const rows = Math.ceil(VIEW.h / step);

  return (
    <g stroke="var(--line)" strokeWidth="0.5">
      {Array.from({ length: columns }, (_, i) => (
        <line key={`c${i}`} x1={i * step} y1={0} x2={i * step} y2={VIEW.h} />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <line key={`r${i}`} x1={0} y1={i * step} x2={VIEW.w} y2={i * step} />
      ))}
    </g>
  );
}

/**
 * SpillSense — incidents scattered over a coastline, sized by volume the way
 * the real map sizes them, with the trend strip the dashboard puts underneath.
 */
function SpillPoster() {
  const random = seeded(1017);

  const incidents = Array.from({ length: 38 }, () => {
    // Pulled toward two loose basins so it reads as geography, not confetti.
    const basin = random() > 0.45;
    const cx = basin
      ? 90 + random() * 120 + random() * 40
      : 210 + random() * 150;
    const cy = basin ? 60 + random() * 110 : 90 + random() * 120;

    return {
      cx: round(cx),
      cy: round(cy),
      r: round(1.8 + random() * random() * 8),
      hot: random() > 0.72,
    };
  });

  const trend = Array.from({ length: 26 }, (_, i) =>
    round(6 + Math.abs(Math.sin(i * 0.7) * 18) + random() * 12),
  );

  return (
    <>
      <Graticule />

      {/* Coastline: the boundary every incident is filtered against. */}
      <path
        d="M-4 96 C 60 78, 96 122, 148 116 S 236 74, 292 100 S 372 142, 412 118"
        fill="none"
        stroke="var(--tone)"
        strokeOpacity="0.32"
        strokeWidth="1.25"
      />
      <path
        d="M-4 96 C 60 78, 96 122, 148 116 S 236 74, 292 100 S 372 142, 412 118 L 412 -8 L -4 -8 Z"
        fill="var(--tone)"
        fillOpacity="0.05"
      />

      {incidents.map((dot, index) => (
        <g key={index}>
          {dot.hot ? (
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r={round(dot.r * 2.4)}
              fill="var(--tone)"
              fillOpacity="0.07"
            />
          ) : null}
          <circle
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="var(--tone)"
            fillOpacity={dot.hot ? 0.72 : 0.3}
            className="transition-opacity duration-700 group-hover:opacity-100"
          />
        </g>
      ))}

      {/* Monthly trend, clipped to the base of the frame. */}
      <g>
        {trend.map((height, index) => (
          <rect
            key={index}
            x={round(10 + index * 15)}
            y={round(VIEW.h - 16 - height)}
            width="7"
            height={height}
            rx="1.5"
            fill="var(--tone)"
            fillOpacity={index % 4 === 0 ? 0.5 : 0.2}
          />
        ))}
      </g>
    </>
  );
}

/**
 * Neo Tokyo Transit — lines stacked at their real relative depths, with
 * interchange pillars rising through the layers.
 */
function TransitPoster() {
  const random = seeded(2269);

  const lines = Array.from({ length: 6 }, (_, index) => {
    const base = 46 + index * 30;
    const points = Array.from({ length: 7 }, (_, step) => ({
      x: round(-10 + step * 70),
      y: round(base + Math.sin(step * 1.1 + index) * (10 + random() * 14)),
    }));

    return {
      d: points
        .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
        .join(" "),
      stations: points.slice(1, 6),
      opacity: round(0.22 + index * 0.12),
    };
  });

  const interchanges = [
    { x: 130, top: 46, bottom: 226 },
    { x: 270, top: 76, bottom: 196 },
  ];

  return (
    <>
      <Graticule step={40} />

      {interchanges.map((pillar) => (
        <line
          key={pillar.x}
          x1={pillar.x}
          y1={pillar.top}
          x2={pillar.x}
          y2={pillar.bottom}
          stroke="var(--tone)"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      ))}

      {lines.map((line, index) => (
        <g key={index}>
          <path
            d={line.d}
            fill="none"
            stroke="var(--tone)"
            strokeOpacity={line.opacity}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {line.stations.map((station, stationIndex) => (
            <circle
              key={stationIndex}
              cx={station.x}
              cy={station.y}
              r="2.6"
              fill="var(--canvas)"
              stroke="var(--tone)"
              strokeOpacity={round(Math.min(1, line.opacity + 0.28))}
              strokeWidth="1.4"
            />
          ))}
        </g>
      ))}

      {/* A planned route lit through the network. */}
      <path
        d={lines[2].d}
        fill="none"
        stroke="var(--tone)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="opacity-0 transition-opacity duration-700 group-hover:opacity-90"
      />
    </>
  );
}

/**
 * Tokyo Move-in Cost — the ward choropleth on the left, the fee stack the
 * calculator breaks a lease into on the right.
 */
function WardPoster() {
  const random = seeded(3023);

  const wards = Array.from({ length: 23 }, (_, index) => ({
    x: round(24 + (index % 6) * 38),
    y: round(48 + Math.floor(index / 6) * 38),
    fill: round(0.1 + random() * 0.62),
  }));

  const stack = [
    { label: 34, opacity: 0.72 },
    { label: 26, opacity: 0.52 },
    { label: 18, opacity: 0.38 },
    { label: 14, opacity: 0.26 },
    { label: 10, opacity: 0.16 },
  ];

  let offset = 0;

  return (
    <>
      <Graticule step={40} />

      {wards.map((ward, index) => (
        <rect
          key={index}
          x={ward.x}
          y={ward.y}
          width="30"
          height="30"
          rx="4"
          fill="var(--tone)"
          fillOpacity={ward.fill}
          className="transition-opacity duration-700 group-hover:opacity-90"
        />
      ))}

      {/* Upfront cost, stacked: deposit, key money, agency, guarantor, rent. */}
      <g transform="translate(272, 40)">
        {stack.map((band, index) => {
          const y = offset;
          offset += band.label + 4;
          return (
            <rect
              key={index}
              x="0"
              y={y}
              width="96"
              height={band.label}
              rx="3"
              fill="var(--tone)"
              fillOpacity={band.opacity}
            />
          );
        })}
        <line
          x1="0"
          y1={offset + 6}
          x2="96"
          y2={offset + 6}
          stroke="var(--tone)"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
      </g>
    </>
  );
}

/**
 * ChordLab — a chromagram: twelve pitch classes down, time across, with the
 * decoded chord path lit over the top.
 */
function ChromaPoster() {
  const random = seeded(4145);

  const rows = 12;
  const columns = 30;
  const cellW = 11;
  const cellH = 15;
  const originX = 22;
  const originY = 34;

  // A slow harmonic walk, so the lit path looks decoded rather than random.
  const path: number[] = [];
  let pitch = 4;
  for (let column = 0; column < columns; column += 1) {
    if (column % 5 === 0) {
      pitch = (pitch + (random() > 0.5 ? 5 : 7) + (random() > 0.8 ? 1 : 0)) % 12;
    }
    path.push(pitch);
  }

  return (
    <>
      {Array.from({ length: columns }, (_, column) =>
        Array.from({ length: rows }, (_, row) => {
          const onPath =
            row === path[column] ||
            row === (path[column] + 4) % 12 ||
            row === (path[column] + 7) % 12;

          return (
            <rect
              key={`${column}-${row}`}
              x={round(originX + column * cellW)}
              y={round(originY + row * cellH)}
              width={cellW - 2.5}
              height={cellH - 2.5}
              rx="1.5"
              fill="var(--tone)"
              fillOpacity={round(onPath ? 0.42 + random() * 0.4 : random() * 0.13)}
            />
          );
        }),
      )}

      {/* Onset markers along the bottom — where the transcription segments. */}
      <g>
        {Array.from({ length: columns }, (_, column) =>
          column % 5 === 0 ? (
            <rect
              key={column}
              x={round(originX + column * cellW)}
              y={round(originY + rows * cellH + 8)}
              width="2"
              height="10"
              rx="1"
              fill="var(--tone)"
              fillOpacity="0.6"
            />
          ) : null,
        )}
      </g>
    </>
  );
}

/**
 * Kasane — 重ね, "layering". Audio at the top, the aligned layers the pipeline
 * stacks on top of it in the middle, and the tokenised words those layers
 * resolve to at the bottom.
 */
function LayerPoster() {
  const random = seeded(5387);

  // The card crops this hard when it stacks — a 400×260 box sliced into a wide
  // short slot keeps roughly y 60–205. Everything that carries the idea is
  // composed inside that band; only the graticule is allowed to bleed past it.
  const bars = Array.from({ length: 46 }, (_, index) => {
    // An envelope, so it reads as speech rather than a noise floor.
    const envelope = Math.abs(Math.sin(index * 0.36)) * 0.7 + 0.3;
    return round(4 + envelope * random() * 26);
  });

  // Word tokens: variable widths, the way real morphemes segment.
  const tokens: { x: number; width: number; lit: boolean }[] = [];
  let cursor = 26;
  while (cursor < 356) {
    const width = round(13 + random() * 26);
    tokens.push({ x: round(cursor), width, lit: random() > 0.72 });
    cursor += width + 6;
  }

  const layers = [
    { y: 106, inset: 0, opacity: 0.07 },
    { y: 124, inset: 14, opacity: 0.12 },
    { y: 142, inset: 28, opacity: 0.18 },
    { y: 160, inset: 42, opacity: 0.26 },
  ];

  return (
    <>
      <Graticule step={40} />

      {/* Source audio. */}
      <g>
        {bars.map((height, index) => (
          <rect
            key={index}
            x={round(26 + index * 7.8)}
            y={round(78 - height / 2)}
            width="3"
            height={height}
            rx="1.5"
            fill="var(--tone)"
            fillOpacity={round(0.26 + (index % 5) * 0.1)}
          />
        ))}
      </g>

      {/* Alignment ticks tying the stack back to the waveform. Behind the
          layers, so they read as guides rather than decoration on top. */}
      <g
        stroke="var(--tone)"
        strokeOpacity="0.24"
        strokeWidth="0.75"
        strokeDasharray="2 4"
      >
        {[96, 180, 264].map((x) => (
          <line key={x} x1={x} y1="92" x2={x} y2="196" />
        ))}
      </g>

      {/* 重ね — the layers the pipeline stacks over that audio: recognition,
          translation, readings, examples. Each is offset and a step more
          opaque, so the stack reads as depth rather than four equal bars. */}
      <g>
        {layers.map((layer, index) => (
          <g key={index}>
            <rect
              x={round(30 + layer.inset)}
              y={layer.y}
              width={round(300 - layer.inset * 0.4)}
              height="24"
              rx="5"
              fill="var(--tone)"
              fillOpacity={layer.opacity}
              stroke="var(--tone)"
              strokeOpacity={round(0.2 + index * 0.12)}
              strokeWidth="0.75"
            />
            {/* Content sitting on each layer, dimmer the further back it is. */}
            <rect
              x={round(42 + layer.inset)}
              y={round(layer.y + 9)}
              width={round(150 - index * 22)}
              height="6"
              rx="3"
              fill="var(--tone)"
              fillOpacity={round(0.3 + index * 0.14)}
            />
          </g>
        ))}
      </g>

      {/* The tokens those layers resolve to. */}
      <g>
        {tokens.map((token, index) => (
          <rect
            key={index}
            x={token.x}
            y="192"
            width={token.width}
            height="10"
            rx="3"
            fill="var(--tone)"
            fillOpacity={token.lit ? 0.7 : 0.22}
            className={
              token.lit
                ? "transition-opacity duration-700 group-hover:opacity-100"
                : undefined
            }
          />
        ))}
      </g>
    </>
  );
}

/**
 * NeuralRig — the signal chain, drawn as one: a waveform gaining amplitude as
 * it crosses the stages, the eight stages themselves with the NAM capture lit,
 * and the tone stack's response curve underneath.
 */
function RigPoster() {
  const random = seeded(6421);

  // Amplitude envelope rising left to right — gain staging, visually.
  const wave = Array.from({ length: 58 }, (_, index) => {
    const envelope = 0.28 + (index / 57) * 0.72;
    return round(5 + envelope * (8 + random() * 24));
  });

  const stages = Array.from({ length: 8 }, (_, index) => ({
    x: round(20 + index * 46),
    // The capture is the stage everything else is arranged around.
    lit: index === 2,
  }));

  return (
    <>
      <Graticule step={40} />

      {/* Signal, centred on its own baseline. */}
      <g>
        {wave.map((height, index) => (
          <rect
            key={index}
            x={round(22 + index * 6.3)}
            y={round(86 - height / 2)}
            width="2.5"
            height={height}
            rx="1.25"
            fill="var(--tone)"
            fillOpacity={round(0.22 + (index / 57) * 0.5)}
          />
        ))}
      </g>

      {/* Gate threshold: the line the trigger is decided against. */}
      <line
        x1="16"
        y1="108"
        x2="384"
        y2="108"
        stroke="var(--tone)"
        strokeOpacity="0.28"
        strokeWidth="0.75"
        strokeDasharray="3 5"
      />

      {/* The chain. */}
      <line
        x1="12"
        y1="142"
        x2="388"
        y2="142"
        stroke="var(--tone)"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <g>
        {stages.map((stage, index) => (
          <rect
            key={index}
            x={stage.x}
            y="130"
            width="34"
            height="24"
            rx="5"
            fill="var(--tone)"
            fillOpacity={stage.lit ? 0.55 : 0.14}
            stroke="var(--tone)"
            strokeOpacity={stage.lit ? 0.8 : 0.3}
            strokeWidth="0.75"
            className={
              stage.lit
                ? "transition-opacity duration-700 group-hover:opacity-100"
                : undefined
            }
          />
        ))}
      </g>

      {/* Tone stack response. */}
      <path
        d="M 16 196 C 70 196, 96 178, 140 180 S 214 202, 262 186 S 336 166, 386 176"
        fill="none"
        stroke="var(--tone)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 16 196 C 70 196, 96 178, 140 180 S 214 202, 262 186 S 336 166, 386 176 L 386 214 L 16 214 Z"
        fill="var(--tone)"
        fillOpacity="0.07"
      />
    </>
  );
}

const posters: Record<string, () => React.ReactElement> = {
  kasane: LayerPoster,
  "neural-rig": RigPoster,
  spillsense: SpillPoster,
  "tokyo-train-map": TransitPoster,
  apartmentfeesjapan: WardPoster,
  "chord-finder": ChromaPoster,
};

export function ProjectPoster({ slug, tone = "accent", className }: PosterProps) {
  const Poster = posters[slug];
  if (!Poster) return null;

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden
      className={cn("size-full", className)}
      style={{ "--tone": tones[tone] } as React.CSSProperties}
    >
      <Poster />
    </svg>
  );
}
