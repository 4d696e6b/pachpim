import type { Metadata } from "next";
import { CollectionHeading } from "@/components/shared/collection-heading";

import { NoteBrowser } from "@/features/notes/note-browser";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPublicContent();
  return {
    title: "Experience",
    description: siteIdentity(profile).description,
    alternates: { canonical: "/experience" },
  };
}

export default async function NotesPage() {
  const { notes } = await getPublicContent();
  return (
    <section className="section container">
      <CollectionHeading
        eyebrow="Experience"
        title="Small moments. Meaningful progress."
        description="A few milestones, lessons, and announcements from my journey in software and beyond."
        count={notes.length}
        unit="updates"
      />
      <div className="mt-12">
        <NoteBrowser notes={notes} />
      </div>
    </section>
  );
}
