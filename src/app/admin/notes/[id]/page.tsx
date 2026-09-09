import { notFound } from "next/navigation";

import { NoteForm } from "@/features/notes/note-form";
import type { NoteFormValues } from "@/features/notes/note-form-schema";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snapshot = await getAdminFirestore().collection("notes").doc(id).get();
  if (!snapshot.exists) notFound();
  const data = snapshot.data()!;
  const publishedAt =
    data.publishedAt && typeof data.publishedAt.toDate === "function"
      ? data.publishedAt.toDate().toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
  const values: NoteFormValues = {
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    excerpt: String(data.excerpt ?? ""),
    body: String(data.body ?? ""),
    category: String(data.category ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
    status: data.status === "published" ? "published" : "draft",
    coverImageUrl: String(data.coverImageUrl ?? ""),
    publishedAt,
  };
  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Notes</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Edit note</h1>
      <p className="text-muted-foreground mt-2">
        Reading time updates automatically on save.
      </p>
      <div className="mt-8">
        <NoteForm id={id} initialValues={values} />
      </div>
    </div>
  );
}
