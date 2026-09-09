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
  const { notes, profile } = await getPublicContent();
  return (
    <section className="section container">
      <p className="eyebrow">Notes</p>
      <h1 className="display mt-6 max-w-4xl">Notes</h1>
      {profile.shortIntroduction ? (
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
          {profile.shortIntroduction}
        </p>
      ) : null}
      <div className="mt-12">
        <NoteBrowser notes={notes} />
      </div>
    </section>
  );
}
