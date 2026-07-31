import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-xl space-y-4 text-center">
        <p className="label">Design system online</p>
        <h1 className="gradient-ink text-5xl font-medium tracking-tight">
          {site.name}
        </h1>
        <p className="text-pretty text-ink-muted">{site.tagline}</p>
      </div>
    </main>
  );
}
