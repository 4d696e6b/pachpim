"use client";

import { BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
      {visible.length ? (
        <div className="divide-border mt-8 divide-y border-y">
          {visible.map((note) => (
            <article className="group py-8" key={note.id}>
              <Link
                className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start"
                href={`/notes/${note.slug}`}
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{note.category}</Badge>
                    {note.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag}>#{tag}</Badge>
                    ))}
                  </div>
                  <h2 className="group-hover:text-accent mt-4 text-2xl font-semibold tracking-tight transition">
                    {note.title}
                  </h2>
                  <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
                    {note.excerpt}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm">
                  {formatDate(note.publishedAt)} · {note.readingTime} min read
                </p>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            description="Try a broader search term or choose another category."
            icon={BookOpen}
            title="No notes found"
          />
        </div>
      )}
    </div>
  );
}
