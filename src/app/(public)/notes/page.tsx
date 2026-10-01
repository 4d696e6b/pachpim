import type { Metadata } from "next";
import { CollectionHeading } from "@/components/shared/collection-heading";

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
      <CollectionHeading
        eyebrow="Notes"
        title="A notebook for the curious."
        description="Lessons from building software, experiments worth sharing, and ideas I am working through."
        count={notes.length}
        unit="notes"
      />
      <div className="mt-12">
        <NoteBrowser notes={notes} />
      </div>
    </section>
  );
}
