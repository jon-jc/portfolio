"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  AtSign,
  BookOpen,
  Check,
  Command as CommandIcon,
  CornerDownLeft,
  Copy,
  FileText,
  Moon,
  Search,
} from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { featuredProjects } from "@/lib/data";
import { site, navItems } from "@/lib/site";
import { cn, fuzzyScore } from "@/lib/utils";
import { setTheme, useCopy, useScrollLock } from "@/lib/hooks";

/** Lets anything on the page open the palette without prop drilling. */
export const PALETTE_EVENT = "palette:toggle";

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT));
}

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Case studies" | "Projects" | "Links" | "Actions";
  keywords?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
  /** Keeps the palette open — used by the copy action so feedback is visible. */
  keepOpen?: boolean;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const { copied, copy } = useCopy();
  useScrollLock(open);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  // Return focus to whatever opened the palette. Doing this in an effect keyed
  // on `open` — rather than inside close() — keeps the ref read out of any code
  // path reachable from render.
  useEffect(() => {
    if (open) return;

    const target = restoreFocus.current;
    restoreFocus.current = null;

    // <body> is a common "previously focused" value and isn't focusable, so
    // focusing it would silently leave focus inside the closing dialog.
    if (target?.isConnected && target !== document.body) {
      target.focus();
    } else {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  }, [open]);

  const goto = useCallback(
    (id: string) => {
      const target = document.getElementById(id);

      // The palette is global, but sections only exist on the home page —
      // from a case study, "Experience" has to route home first.
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push(`/#${id}`);
      }
    },
    [router],
  );

  const openLink = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  }, []);

  const commands = useMemo<Command[]>(() => {
    const navigate: Command[] = navItems.map((item) => ({
      id: `nav-${item.id}`,
      label: item.label,
      hint: "Jump to section",
      group: "Navigate",
      icon: Search,
      run: () => goto(item.id),
    }));

    const studies: Command[] = featuredProjects.map((project) => ({
      id: `case-${project.slug}`,
      label: project.name,
      hint: "Read the case study",
      group: "Case studies",
      keywords: `${project.tagline} ${project.stack.join(" ")} write-up`,
      icon: BookOpen,
      run: () => router.push(`/work/${project.slug}`),
    }));

    const projects: Command[] = featuredProjects
      .filter((project) => project.live)
      .map((project) => ({
        id: `project-${project.slug}`,
        label: project.name,
        hint: "Open live site",
        group: "Projects",
        keywords: `${project.tagline} demo deployed vercel`,
        icon: ArrowUpRight,
        run: () => openLink(project.live as string),
      }));

    const links: Command[] = [
      {
        id: "link-github",
        label: "GitHub",
        hint: "github.com/jon-jc",
        group: "Links",
        icon: GithubIcon,
        run: () => openLink(site.links.github),
      },
      {
        id: "link-linkedin",
        label: "LinkedIn",
        hint: "linkedin.com/in/jon-jc",
        group: "Links",
        icon: LinkedinIcon,
        run: () => openLink(site.links.linkedin),
      },
      {
        id: "link-resume",
        label: "Resume",
        hint: "Full resume, printable",
        group: "Links",
        keywords: "cv download pdf print",
        icon: FileText,
        run: () => router.push("/resume"),
      },
    ];

    const actions: Command[] = [
      {
        id: "action-email",
        label: "Email me",
        hint: site.email,
        group: "Actions",
        icon: AtSign,
        run: () => {
          window.location.href = site.links.email;
        },
      },
      {
        id: "action-copy-email",
        label: "Copy email address",
        hint: site.email,
        group: "Actions",
        keywords: "clipboard",
        icon: Copy,
        keepOpen: true,
        run: () => void copy(site.email),
      },
      {
        id: "action-theme",
        label: "Toggle theme",
        hint: "Light / dark",
        group: "Actions",
        keywords: "dark mode light appearance",
        icon: Moon,
        run: toggleTheme,
      },
    ];

    return [...navigate, ...studies, ...projects, ...links, ...actions];
  }, [goto, openLink, toggleTheme, copy, router]);

  const results = useMemo(() => {
    if (!query.trim()) return commands;

    return commands
      .map((command) => ({
        command,
        score: fuzzyScore(
          `${command.label} ${command.group} ${command.keywords ?? ""}`,
          query.trim(),
        ),
      }))
      .filter(
        (entry): entry is { command: Command; score: number } => entry.score !== null,
      )
      .sort((a, b) => a.score - b.score)
      .map((entry) => entry.command);
  }, [commands, query]);

  const grouped = useMemo(() => {
    const map = new Map<Command["group"], Command[]>();
    for (const command of results) {
      const bucket = map.get(command.group);
      if (bucket) bucket.push(command);
      else map.set(command.group, [command]);
    }
    return [...map.entries()];
  }, [results]);

  // Global open/close shortcut, plus the programmatic entry point used by the
  // nav button so callers don't have to fake a keyboard event.
  useEffect(() => {
    const toggle = () => {
      restoreFocus.current = document.activeElement as HTMLElement;
      setOpen((prev) => !prev);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
        return;
      }

      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(PALETTE_EVENT, toggle);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(PALETTE_EVENT, toggle);
    };
  }, []);

  // Keep the highlighted row scrolled into view as the cursor moves.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor, open]);

  const runCommand = useCallback(
    (command: Command) => {
      command.run();
      if (!command.keepOpen) close();
    },
    [close],
  );

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((prev) => (results.length ? (prev + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((prev) =>
        results.length ? (prev - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = results[cursor];
      if (command) runCommand(command);
    }
  };

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          // AnimatePresence tracks children by key. Without one it never
          // completes the removal, leaving an invisible full-screen overlay
          // swallowing every click on the page.
          key="command-palette"
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <button
            type="button"
            aria-label="Close command palette"
            onClick={close}
            className="absolute inset-0 cursor-default bg-canvas-deep/70 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-hi bg-surface shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-ink-faint" />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCursor(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search projects, sections, links…"
                aria-label="Search commands"
                className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
              />
              <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint sm:block">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
              {grouped.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-ink-faint">
                  No matches for “{query}”
                </p>
              ) : (
                grouped.map(([group, items]) => (
                  <div key={group} className="mb-1">
                    <p className="label px-3 py-2">{group}</p>
                    {items.map((command) => {
                      flatIndex += 1;
                      const index = flatIndex;
                      const selected = index === cursor;
                      const Icon = command.icon;
                      const justCopied = copied && command.id === "action-copy-email";

                      return (
                        <button
                          key={command.id}
                          type="button"
                          data-selected={selected}
                          onMouseMove={() => setCursor(index)}
                          onClick={() => runCommand(command)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                            selected ? "bg-surface-hi text-ink" : "text-ink-muted",
                          )}
                        >
                          {justCopied ? (
                            <Check className="size-4 shrink-0 text-accent" />
                          ) : (
                            <Icon
                              className={cn(
                                "size-4 shrink-0",
                                selected ? "text-accent" : "text-ink-faint",
                              )}
                            />
                          )}
                          <span className="flex-1 truncate">
                            {justCopied ? "Copied to clipboard" : command.label}
                          </span>
                          {command.hint ? (
                            <span className="hidden truncate font-mono text-xs text-ink-faint sm:block">
                              {command.hint}
                            </span>
                          ) : null}
                          {selected ? (
                            <CornerDownLeft className="size-3.5 shrink-0 text-ink-faint" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-ink-faint">
              <span className="flex items-center gap-1.5 font-mono">
                <CommandIcon className="size-3" />K
              </span>
              <span className="flex items-center gap-3 font-mono">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Small affordance in the nav so the shortcut is discoverable. */
export function CommandHint() {
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-label="Open command palette"
      // Yields the row to the resume link below lg: the shortcut still works
      // everywhere, this is only its affordance.
      className="hidden items-center gap-2 rounded-full border border-line bg-surface/60 py-1.5 pl-3 pr-2 text-xs text-ink-faint transition-colors hover:border-line-hi hover:text-ink-muted lg:flex"
    >
      <Search className="size-3.5" />
      <span>Search</span>
      <kbd className="rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[10px]">
        ⌘K
      </kbd>
    </button>
  );
}
