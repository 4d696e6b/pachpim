import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CmsImage } from "@/components/shared/cms-image";
import { Badge } from "@/components/ui/form-controls";
import type { PublicProject } from "@/lib/server/public-content";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  priority = false,
  className,
}: {
  project: PublicProject;
  priority?: boolean;
  className?: string;
}) {
  return (
    <article className={cn("group", className)}>
      <Link
        aria-label={`View ${project.title} project`}
        className="bg-card block overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        href={`/projects/${project.slug}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,var(--muted),color-mix(in_srgb,var(--accent)_18%,var(--background)))]">
          {project.coverImageUrl ? (
            <CmsImage
              alt={`${project.title} cover`}
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              fill
              priority={priority}
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={project.coverImageUrl}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="text-foreground/10 text-6xl font-semibold tracking-tighter">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{project.category}</Badge>
              <Badge>{project.year}</Badge>
            </div>
            <ArrowUpRight className="text-muted-foreground group-hover:text-accent size-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight">
            {project.title}
          </h2>
          <p className="text-muted-foreground mt-3 line-clamp-2 leading-7">
            {project.excerpt}
          </p>
          <div className="text-muted-foreground mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
            {project.technologies.slice(0, 4).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
