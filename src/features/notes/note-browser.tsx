"use client";

import { ArrowUpRight, Sparkles, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CmsImage } from "@/components/shared/cms-image";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/form-controls";
import type { PublicNote } from "@/lib/server/public-content";
import { formatDate } from "@/lib/utils";

export function NoteBrowser({ notes }: { notes: PublicNote[] }) {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = [...new Set(notes.map((note) => note.category))].sort();
  const visible = [...notes]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .filter(
      (note) =>
        (category === "all" || note.category === category) &&
        `${note.title} ${note.excerpt} ${note.tags.join(" ")}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
  return (
    <div className="mx-auto max-w-3xl">
      {notes.length > 0 && (
        <div className="mb-8 grid gap-4">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <Input
              aria-label="Search experiences"
              placeholder="Find a moment…"
              type="search"
              className="pl-11"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter experiences">
            {["all", ...categories].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-xs transition ${category === item ? "bg-accent text-accent-foreground border-accent" : "hover:bg-muted"}`}
              >
                {item === "all" ? "All moments" : item}
              </button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs" aria-live="polite">
            {visible.length} {visible.length === 1 ? "update" : "updates"}
          </p>
        </div>
      )}
      <AnimatePresence initial={false} mode="popLayout">
        {visible.length ? (
          <motion.div
            className="grid gap-6"
            key="results"
            layout={!reduceMotion}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((note) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  key={note.id}
                  layout={!reduceMotion}
                  transition={{
                    duration: reduceMotion ? 0 : 0.32,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <article className="journal-card group">
                    <Link
                      href={`/experience/${note.slug}`}
                      className="bg-card hover:border-accent/40 block overflow-hidden rounded-2xl border transition"
                    >
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-accent bg-accent/10 rounded-full px-3 py-1 text-xs font-medium">
                            {note.category}
                          </span>
                          <time
                            dateTime={note.publishedAt}
                            className="text-muted-foreground font-mono text-xs"
                          >
                            {formatDate(note.publishedAt)}
                          </time>
                        </div>
                        <h2 className="group-hover:text-accent mt-5 text-2xl font-semibold tracking-tight transition">
                          {note.title}
                        </h2>
                        <p className="text-muted-foreground mt-3 leading-7">
                          {note.excerpt}
                        </p>
                        {note.coverImageUrl && (
                          <div className="bg-muted relative mt-6 aspect-video overflow-hidden rounded-xl">
                            <CmsImage
                              src={note.coverImageUrl}
                              alt={note.title}
                              fill
                              className="object-contain transition duration-500 group-hover:scale-[1.02]"
                              sizes="(min-width: 768px) 700px, 90vw"
                            />
                          </div>
                        )}
                        <div className="text-muted-foreground mt-6 flex items-center justify-between gap-4 text-xs">
                          <span>
                            {note.tags
                              .slice(0, 3)
                              .map((tag) => `#${tag}`)
                              .join("  ")}
                          </span>
                          <span className="text-accent flex shrink-0 items-center gap-2">
                            Read update{" "}
                            <ArrowUpRight className="size-4 transition group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            key="empty"
          >
            <EmptyState
              icon={Sparkles}
              title={
                notes.length
                  ? "No matching moments"
                  : "A little more of the journey, soon."
              }
              description={
                notes.length
                  ? "Try another search or choose a different post type."
                  : "Selected milestones, experiences, and announcements will appear here."
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
