"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdminAction } from "@/lib/auth/session";
import { getAdminFirestore } from "@/lib/server/firebase-admin";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/features/projects/project-form-schema";

function splitList(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMetrics(value: string) {
  return value
    .split("\n")
    .map((line) => line.split(":"))
    .filter((parts) => parts.length >= 2)
    .map(([label, ...rest]) => ({
      label: label.trim(),
      value: rest.join(":").trim(),
    }))
    .filter((metric) => metric.label && metric.value);
}

export async function saveProject(
  id: string | null,
  rawValues: ProjectFormValues,
) {
  try {
    const admin = await requireAdminAction();
    const values = projectFormSchema.parse(rawValues);
    const db = getAdminFirestore();
    const projectRef = id
      ? db.collection("projects").doc(id)
      : db.collection("projects").doc();
    await db.runTransaction(async (transaction) => {
      const current = await transaction.get(projectRef);
      const oldSlug = current.exists ? String(current.get("slug")) : null;
      const slugRef = db
        .collection("slugReservations")
        .doc(`project-${values.slug}`);
      const slugSnapshot = await transaction.get(slugRef);
      if (
        slugSnapshot.exists &&
        slugSnapshot.get("entityId") !== projectRef.id
      ) {
        throw new Error("That slug is already in use.");
      }

      const now = FieldValue.serverTimestamp();
      transaction.set(slugRef, {
        id: slugRef.id,
        kind: "project",
        slug: values.slug,
        entityId: projectRef.id,
        createdBy: admin.uid,
        createdAt: slugSnapshot.exists
          ? (slugSnapshot.get("createdAt") ?? now)
          : now,
        updatedBy: admin.uid,
        updatedAt: now,
      });
      if (oldSlug && oldSlug !== values.slug) {
        transaction.delete(
          db.collection("slugReservations").doc(`project-${oldSlug}`),
        );
      }
      transaction.set(
        projectRef,
        {
          id: projectRef.id,
          ...values,
          visibility: values.status === "published" ? "public" : "private",
          technologies: splitList(values.technologies),
          gallery: splitList(values.gallery),
          metrics: parseMetrics(values.metrics),
          coverImageUrl: values.coverImageUrl || null,
          liveUrl: values.liveUrl || null,
          repositoryUrl: values.repositoryUrl || null,
          createdBy: current.exists ? current.get("createdBy") : admin.uid,
          createdAt: current.exists ? current.get("createdAt") : now,
          updatedBy: admin.uid,
          updatedAt: now,
        },
        { merge: true },
      );
    });
    revalidateTag("public-content", "max");
    revalidatePath("/admin/projects");
    return { ok: true as const, id: projectRef.id };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Project could not be saved.",
    };
  }
}

export async function deleteProject(id: string) {
  const admin = await requireAdminAction();
  const db = getAdminFirestore();
  const reference = db.collection("projects").doc(id);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) return;
    transaction.delete(reference);
    const slug = snapshot.get("slug") as string;
    if (slug)
      transaction.delete(
        db.collection("slugReservations").doc(`project-${slug}`),
      );
    transaction.set(db.collection("auditLog").doc(), {
      action: "project.deleted",
      entityId: id,
      createdBy: admin.uid,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  revalidateTag("public-content", "max");
  revalidatePath("/admin/projects");
}
