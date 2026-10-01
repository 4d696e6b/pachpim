"use client";

import { ArrowUpRight, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Stagger, StaggerItem } from "@/components/shared/motion";
import { CmsImage } from "@/components/shared/cms-image";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge, Input } from "@/components/ui/form-controls";
import type { PublicNote } from "@/lib/server/public-content";
import { formatDate } from "@/lib/utils";

export function NoteBrowser({ notes }: { notes: PublicNote[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = [...new Set(notes.map((note) => note.category))].sort();
  const normalized = query.trim().toLowerCase();
  const visible = notes.filter(
    (note) =>
      (category === "all" || note.category === category) &&
      (!normalized ||
        `${note.title} ${note.excerpt} ${note.tags.join(" ")}`
          .toLowerCase()
          .includes(normalized)),
  );

  return (
    <div>
      <div className="bg-card grid gap-3 rounded-3xl border p-4 sm:grid-cols-[1fr_220px] sm:p-6">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            aria-label="Search notes"
            className="pl-10"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes and tags…"
            type="search"
            value={query}
          />
        </div>
        <select
          aria-label="Filter by category"
          className="bg-background focus:ring-accent/25 h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <p className="text-muted-foreground mt-6 text-xs" aria-live="polite">
        {visible.length} {visible.length === 1 ? "note" : "notes"}
        {query || category !== "all" ? " found" : " in the notebook"}
      </p>
      {visible.length ? (
        <Stagger className="mt-5 grid gap-6 md:grid-cols-2">
          {visible.map((note, index) => (
            <StaggerItem key={note.id}>
              <article className="journal-card group h-full">
                <Link
                  className="bg-card hover:border-accent/40 focus-visible:outline-accent flex h-full flex-col overflow-hidden rounded-2xl border transition duration-300"
                  href={`/notes/${note.slug}`}
                >
                  <div className="preview-cover relative aspect-[16/9] overflow-hidden border-b">
                    {note.coverImageUrl ? (
                      <CmsImage
                        alt={`${note.title} cover`}
                        className="object-cover transition duration-700 group-hover:scale-105"
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        src={note.coverImageUrl}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-end justify-between p-7">
                        <span className="text-accent/25 font-mono text-7xl tracking-tighter">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <BookOpen
                          className="text-accent/50 size-10"
                          strokeWidth={1}
                        />
                      </div>
                    )}
                    <span className="bg-background/90 absolute top-4 left-4 rounded-full border px-3 py-1 text-xs backdrop-blur">
                      {note.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="text-muted-foreground font-mono text-xs">
                      {formatDate(note.publishedAt)} · {note.readingTime} min
                      read
                    </p>
                    <h2 className="group-hover:text-accent mt-4 text-2xl font-semibold tracking-tight transition">
                      {note.title}
                    </h2>
                    <p className="text-muted-foreground mt-3 line-clamp-3 leading-7">
                      {note.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-7">
                      <div className="flex flex-wrap gap-2">
                        {note.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag}>#{tag}</Badge>
                        ))}
                      </div>
                      <ArrowUpRight className="text-accent size-5 shrink-0 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="mt-8">
          <EmptyState
            description={
              notes.length
                ? "Try a broader search term or choose another category."
                : "This notebook is just getting started. New ideas will appear here as they are published."
            }
            icon={BookOpen}
            title={notes.length ? "No notes found" : "More ideas on the way"}
          />
        </div>
      )}
    </div>
  );
}
