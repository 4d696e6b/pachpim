import type { Metadata } from "next";

import { NoteBrowser } from "@/features/notes/note-browser";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPublicContent();
  return {
    title: "Notes",
    description: siteIdentity(profile).description,
    alternates: { canonical: "/notes" },
  };
}

export default async function NotesPage() {
  const { notes } = await getPublicContent();
  return (
    <section className="section container">
      <p className="eyebrow">Notes</p>
      <h1 className="page-title mt-6 max-w-4xl">Notes and ideas</h1>
      <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
        What I am learning about software, systems, and building products that
        people can understand and trust.
      </p>
      <div className="mt-12">
        <NoteBrowser notes={notes} />
      </div>
    </section>
  );
}
