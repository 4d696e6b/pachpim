import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/form-controls";
import { siteConfig } from "@/config/site";
import {
  getTableOfContents,
  MarkdownContent,
} from "@/features/notes/markdown-content";
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
    alternates: { canonical: `/notes/${slug}` },
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
  const toc = getTableOfContents(note.body);
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
          url: `${siteConfig.url}/notes/${note.slug}`,
          author: { "@type": "Person", name: siteIdentity(profile).name },
        }}
      />
      <article className="container py-12 sm:py-20">
        <Button asChild size="sm" variant="ghost">
          <Link href="/notes">
            <ArrowLeft className="size-4" /> All notes
          </Link>
        </Button>
        <header className="mx-auto mt-10 max-w-3xl">
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
            {formatDate(note.publishedAt)} · {note.readingTime} min read
          </p>
        </header>
        <div className="mx-auto mt-14 grid max-w-5xl gap-12 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <nav aria-label="Table of contents" className="sticky top-28">
              <p className="text-xs font-semibold tracking-wider uppercase">
                On this page
              </p>
              <ol className="text-muted-foreground mt-4 grid gap-2 text-sm">
                {toc.map((item) => (
                  <li className={item.level === 3 ? "pl-3" : ""} key={item.id}>
                    <a className="hover:text-accent" href={`#${item.id}`}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <MarkdownContent body={note.body} />
        </div>
      </article>
      {related.length ? (
        <section className="bg-muted/35 border-t">
          <div className="container py-16">
            <p className="eyebrow">Related notes</p>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  className="bg-card hover:border-accent/35 rounded-3xl border p-6"
                  href={`/notes/${item.slug}`}
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
