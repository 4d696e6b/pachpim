import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/form-controls";
import { siteConfig } from "@/config/site";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublicContent } from "@/lib/server/public-content";
import { isSafeUrl } from "@/lib/security";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getPublicContent();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.title,
      description: project.excerpt,
      type: "article",
      images: project.coverImageUrl ? [project.coverImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.excerpt,
      images: project.coverImageUrl ? [project.coverImageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const { projects } = await getPublicContent();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const { projects } = await getPublicContent();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const related = projects
    .filter(
      (item) => item.id !== project.id && item.category === project.category,
    )
    .slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.excerpt,
          url: `${siteConfig.url}/projects/${project.slug}`,
          dateModified: project.updatedAt,
          keywords: project.technologies.join(", "),
        }}
      />
      <article>
        <header className="container pt-12 pb-16 sm:pt-20">
          <Button asChild size="sm" variant="ghost">
            <Link href="/projects">
              <ArrowLeft className="size-4" /> All projects
            </Link>
          </Button>
          <div className="mt-10 max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <Badge>{project.category}</Badge>
              <Badge>{project.statusLabel}</Badge>
              <Badge>{project.year}</Badge>
            </div>
            <h1 className="display mt-6">{project.title}</h1>
            <p className="text-muted-foreground mt-7 max-w-3xl text-xl leading-9 whitespace-pre-wrap">
              {project.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && isSafeUrl(project.liveUrl) ? (
                <Button asChild variant="accent">
                  <a
                    href={project.liveUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Visit website <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              ) : null}
              {project.repositoryUrl && isSafeUrl(project.repositoryUrl) ? (
                <Button asChild variant="outline">
                  <a
                    href={project.repositoryUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <Code2 className="size-4" /> Source repository
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        <div className="container">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[2.5rem] border bg-[linear-gradient(135deg,var(--muted),color-mix(in_srgb,var(--accent)_18%,var(--background)))]">
            {project.coverImageUrl ? (
              <Image
                alt={`${project.title} cover`}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1200px) 1180px, 100vw"
                src={project.coverImageUrl}
              />
            ) : null}
          </div>
        </div>

        <div className="section container grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <aside>
            <p className="eyebrow">Built with</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <Badge key={technology}>{technology}</Badge>
              ))}
            </div>
            {project.metrics.length ? (
              <div className="mt-10 grid grid-cols-2 gap-3">
                {project.metrics.map((metric) => (
                  <Card key={metric.label}>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-semibold">{metric.value}</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {metric.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </aside>
          <div className="grid gap-12">
            {[
              ["Challenge", project.challenge],
              ["Approach", project.approach],
              ["Process", project.process],
              ["Outcome", project.outcome],
            ].map(([title, body]) => (
              <section key={title}>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="text-muted-foreground mt-4 text-lg leading-8 whitespace-pre-wrap">
                  {body}
                </p>
              </section>
            ))}
          </div>
        </div>

        {project.gallery.length ? (
          <section className="container grid gap-6 pb-24 md:grid-cols-2">
            {project.gallery.map((image, index) => (
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-3xl border"
                key={image}
              >
                <Image
                  alt={`${project.title} gallery image ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src={image}
                />
              </div>
            ))}
          </section>
        ) : null}
      </article>
      {related.length ? (
        <section className="bg-muted/35 border-t">
          <div className="section container">
            <SectionHeading eyebrow="Keep exploring" title="Related projects" />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
