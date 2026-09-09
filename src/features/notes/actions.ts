"use server";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { revalidatePath, revalidateTag } from "next/cache";

import {
  noteFormSchema,
  type NoteFormValues,
} from "@/features/notes/note-form-schema";
import { requireAdminAction } from "@/lib/auth/session";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export async function saveNote(id: string | null, rawValues: NoteFormValues) {
  try {
    const admin = await requireAdminAction();
    const values = noteFormSchema.parse(rawValues);
    const db = getAdminFirestore();
    const noteRef = id
      ? db.collection("notes").doc(id)
      : db.collection("notes").doc();
    await db.runTransaction(async (transaction) => {
      const current = await transaction.get(noteRef);
      const oldSlug = current.exists ? String(current.get("slug")) : null;
      const slugRef = db
        .collection("slugReservations")
        .doc(`note-${values.slug}`);
      const slugSnapshot = await transaction.get(slugRef);
      if (slugSnapshot.exists && slugSnapshot.get("entityId") !== noteRef.id) {
        throw new Error("That slug is already in use.");
      }
      const now = FieldValue.serverTimestamp();
      transaction.set(slugRef, {
        id: slugRef.id,
        kind: "note",
        slug: values.slug,
        entityId: noteRef.id,
        createdBy: admin.uid,
        createdAt: slugSnapshot.exists
          ? (slugSnapshot.get("createdAt") ?? now)
          : now,
        updatedBy: admin.uid,
        updatedAt: now,
      });
      if (oldSlug && oldSlug !== values.slug) {
        transaction.delete(
          db.collection("slugReservations").doc(`note-${oldSlug}`),
        );
      }
      transaction.set(
        noteRef,
        {
          id: noteRef.id,
          ...values,
          visibility: values.status === "published" ? "public" : "private",
          tags: values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          coverImageUrl: values.coverImageUrl || null,
          publishedAt:
            values.status === "published"
              ? Timestamp.fromDate(new Date(values.publishedAt || Date.now()))
              : null,
          readingTime: readingTime(values.body),
          createdBy: current.exists ? current.get("createdBy") : admin.uid,
          createdAt: current.exists ? current.get("createdAt") : now,
          updatedBy: admin.uid,
          updatedAt: now,
        },
        { merge: true },
      );
    });
    revalidateTag("public-content", "max");
    revalidatePath("/admin/notes");
    return { ok: true as const, id: noteRef.id };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Note could not be saved.",
    };
  }
}

export async function deleteNote(id: string) {
  const admin = await requireAdminAction();
  const db = getAdminFirestore();
  const reference = db.collection("notes").doc(id);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) return;
    transaction.delete(reference);
    const slug = snapshot.get("slug") as string;
    if (slug)
      transaction.delete(db.collection("slugReservations").doc(`note-${slug}`));
    transaction.set(db.collection("auditLog").doc(), {
      action: "note.deleted",
      entityId: id,
      createdBy: admin.uid,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  revalidateTag("public-content", "max");
  revalidatePath("/admin/notes");
}
