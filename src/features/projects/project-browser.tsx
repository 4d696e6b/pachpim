"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/form-controls";
import { ProjectCard } from "@/features/projects/project-card";
import type { PublicProject } from "@/lib/server/public-content";

export function ProjectBrowser({ projects }: { projects: PublicProject[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [technology, setTechnology] = useState("all");
  const [status, setStatus] = useState("all");

  const categories = [...new Set(projects.map((project) => project.category))];
  const years = [...new Set(projects.map((project) => String(project.year)))]
    .sort()
    .reverse();
  const technologies = [
    ...new Set(projects.flatMap((project) => project.technologies)),
  ].sort();
  const statuses = [
    ...new Set(projects.map((project) => project.statusLabel)),
  ].sort();

  const query = search.trim().toLowerCase();
  const visible = projects.filter(
    (project) =>
      (!query ||
        `${project.title} ${project.excerpt} ${project.technologies.join(" ")}`
          .toLowerCase()
          .includes(query)) &&
      (category === "all" || project.category === category) &&
      (year === "all" || String(project.year) === year) &&
      (technology === "all" || project.technologies.includes(technology)) &&
      (status === "all" || project.statusLabel === status),
  );

  return (
    <div>
      <div className="bg-card rounded-3xl border p-4 sm:p-6">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            aria-label="Search projects"
            className="pl-10"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by project, description, or technology…"
            type="search"
            value={search}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Category", category, setCategory, categories],
            ["Status", status, setStatus, statuses],
            ["Year", year, setYear, years],
            ["Technology", technology, setTechnology, technologies],
          ].map(([label, value, setter, options]) => (
            <label
              className="text-muted-foreground grid gap-1.5 text-xs font-medium"
              key={label as string}
            >
              {label as string}
              <select
                className="bg-background text-foreground focus:ring-accent/25 h-10 rounded-xl border px-3 text-sm outline-none focus:ring-2"
                onChange={(event) =>
                  (setter as (value: string) => void)(event.target.value)
                }
                value={value as string}
              >
                <option value="all">All</option>
                {(options as string[]).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
      <p className="text-muted-foreground mt-6 text-sm" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>
      {visible.length ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            description="Try removing a filter or using a broader search term."
            icon={SlidersHorizontal}
            title="No matching projects"
          />
        </div>
      )}
    </div>
  );
}
