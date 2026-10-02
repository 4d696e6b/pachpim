import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CmsImage } from "@/components/shared/cms-image";
import { ImageLightbox } from "@/components/shared/image-lightbox";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/form-controls";
import { siteConfig } from "@/config/site";
import { MarkdownContent } from "@/features/notes/markdown-content";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { notes } = await getPublicContent();
  const note = notes.find((item) => item.slug === slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: `/experience/${slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.excerpt,
      publishedTime: note.publishedAt,
      tags: note.tags,
      images: note.coverImageUrl ? [note.coverImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.excerpt,
    },
  };
}

export async function generateStaticParams() {
  const { notes } = await getPublicContent();
  return notes.map((note) => ({ slug: note.slug }));
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const { notes, profile } = await getPublicContent();
  const note = notes.find((item) => item.slug === slug);
  if (!note) notFound();
  const related = notes
    .filter((item) => item.id !== note.id && item.category === note.category)
    .slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: note.title,
          description: note.excerpt,
          datePublished: note.publishedAt,
          url: `${siteConfig.url}/experience/${note.slug}`,
          author: { "@type": "Person", name: siteIdentity(profile).name },
        }}
      />
      <article className="container py-12 sm:py-20">
        <Button asChild size="sm" variant="ghost">
          <Link href="/experience">
            <ArrowLeft className="size-4" /> All updates
          </Link>
        </Button>
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <header>
            <div className="flex flex-wrap gap-2">
              <Badge>{note.category}</Badge>
              {note.tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-6xl">
              {note.title}
            </h1>
            <p className="text-muted-foreground mt-6 text-xl leading-9">
              {note.excerpt}
            </p>
            <p className="text-muted-foreground mt-6 text-sm">
              {formatDate(note.publishedAt)}
            </p>
          </header>
        </Reveal>
        {note.coverImageUrl ? (
          <Reveal delay={0.08}>
            <ImageLightbox
              alt={`${note.title} cover`}
              className="mx-auto mt-10 max-w-5xl"
              src={note.coverImageUrl}
            >
              <div className="gallery-image relative aspect-[16/8] overflow-hidden rounded-[2rem] border">
                <CmsImage
                  alt={`${note.title} cover`}
                  className="object-cover transition-transform duration-700"
                  fill
                  priority
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  src={note.coverImageUrl}
                />
              </div>
            </ImageLightbox>
          </Reveal>
        ) : null}
        <div className="mx-auto mt-10 max-w-3xl border-t pt-8">
          <Reveal>
            <MarkdownContent body={note.body} />
          </Reveal>
        </div>
      </article>
      {related.length ? (
        <section className="bg-muted/35 border-t">
          <div className="container py-16">
            <p className="eyebrow">More experiences</p>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  className="related-note bg-card hover:border-accent/35 rounded-3xl border p-6 transition duration-300"
                  href={`/experience/${item.slug}`}
                  key={item.id}
                >
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-muted-foreground mt-3 text-sm leading-6">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
