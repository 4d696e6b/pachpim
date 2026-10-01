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
  featured = false,
}: {
  project: PublicProject;
  priority?: boolean;
  className?: string;
  featured?: boolean;
}) {
  return (
    <article className={cn("project-card group", className)}>
      <Link
        aria-label={`View ${project.title} project`}
        className={cn(
          "project-card-link bg-card hover:border-accent/40 block overflow-hidden rounded-2xl border transition duration-500",
          featured && "lg:grid lg:grid-cols-[1.25fr_.75fr]",
        )}
        href={`/projects/${project.slug}`}
      >
        <div
          className={cn(
            "bg-muted relative aspect-[16/10] overflow-hidden",
            featured && "lg:aspect-auto lg:min-h-[28rem]",
          )}
        >
          {project.coverImageUrl ? (
            <CmsImage
              alt={`${project.title} cover`}
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
              fill
              priority={priority}
              sizes={
                featured
                  ? "(min-width: 1024px) 740px, 100vw"
                  : "(min-width: 1024px) 50vw, 100vw"
              }
              src={project.coverImageUrl}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="text-foreground/10 text-6xl font-semibold tracking-tighter">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <span className="project-image-sheen pointer-events-none absolute inset-0" />
        </div>
        <div
          className={cn(
            "p-6 sm:p-8",
            featured && "lg:flex lg:flex-col lg:justify-center lg:p-10",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{project.category}</Badge>
              <Badge>{project.year}</Badge>
            </div>
            <ArrowUpRight className="text-muted-foreground group-hover:text-accent size-5 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-6" />
          </div>
          <h2
            className={cn(
              "mt-5 text-2xl font-semibold tracking-tight",
              featured && "sm:text-3xl",
            )}
          >
            {project.title}
          </h2>
          <p
            className={cn(
              "text-muted-foreground mt-3 leading-7",
              !featured && "line-clamp-2",
            )}
          >
            {project.excerpt}
          </p>
          <div className="text-muted-foreground mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
            {project.technologies.slice(0, 4).map((technology) => (
              <span className="project-tech" key={technology}>
                {technology}
              </span>
            ))}
          </div>
          {featured ? (
            <span className="text-accent mt-8 inline-flex items-center gap-2 text-sm font-semibold">
              Read case study <ArrowUpRight className="size-4" />
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
