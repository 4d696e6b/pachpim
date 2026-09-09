"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath, revalidateTag } from "next/cache";

import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/features/profile/profile-form-schema";
import { requireAdminAction } from "@/lib/auth/session";
import { isImageAssetUrl } from "@/lib/media";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

function optionalParts(value: string, min: number) {
  return value
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(
      (parts) =>
        parts.length >= min &&
        parts.slice(0, min).every((part) => part.length > 0),
    );
}

export async function saveProfile(rawValues: ProfileFormValues) {
  try {
    const admin = await requireAdminAction();
    const values = profileFormSchema.parse(rawValues);
    const db = getAdminFirestore();
    const now = FieldValue.serverTimestamp();
    const batch = db.batch();
    const profileRef = db.collection("profile").doc("public");
    const existing = await profileRef.get();

    batch.set(
      profileRef,
      {
        id: "public",
        name: values.name,
        professionalTitle: values.professionalTitle,
        shortIntroduction: values.shortIntroduction,
        biography: values.biography,
        location: values.location,
        email: values.email.toLowerCase(),
        profilePhotoUrl: values.profilePhotoUrl || null,
        resumeUrl: values.resumeUrl || null,
        availability: values.availability,
        latestUpdate: values.latestUpdate || null,
        socialLinks: optionalParts(values.socialLinks, 2).map(
          ([label, url]) => ({
            label,
            url,
          }),
        ),
        status: "published",
        visibility: "public",
        createdBy: existing.exists ? existing.get("createdBy") : admin.uid,
        createdAt: existing.exists ? existing.get("createdAt") : now,
        updatedBy: admin.uid,
        updatedAt: now,
      },
      { merge: true },
    );

    const collectionRows = [
      {
        collection: "skills",
        values: optionalParts(values.skills, 2).map(
          ([category, name], index) => ({
            category,
            name,
            sortOrder: index,
          }),
        ),
      },
      {
        collection: "experiences",
        values: optionalParts(values.experiences, 4).map(
          ([period, title, organization, description], index) => ({
            period,
            title,
            organization,
            description,
            type: "experience",
            sortOrder: index,
          }),
        ),
      },
      {
        collection: "education",
        values: optionalParts(values.education, 4).map(
          ([period, title, organization, description], index) => ({
            period,
            title,
            organization,
            description,
            type: "education",
            sortOrder: index,
          }),
        ),
      },
      {
        collection: "certifications",
        values: optionalParts(values.certifications, 3).map(
          ([date, title, issuer, urlOrImage = "", image = ""], index) => {
            const fourth = urlOrImage.trim();
            const fifth = image.trim();
            const imageUrl = fifth || (isImageAssetUrl(fourth) ? fourth : "");
            const url = fourth;
            return {
              date,
              title,
              issuer,
              url,
              imageUrl,
              sortOrder: index,
            };
          },
        ),
      },
      {
        collection: "achievements",
        values: optionalParts(values.achievements, 2).map(
          ([title, description], index) => ({
            title,
            description,
            sortOrder: index,
          }),
        ),
      },
    ];

    for (const group of collectionRows) {
      const current = await db.collection(group.collection).get();
      current.docs.forEach((doc) => batch.delete(doc.ref));
      group.values.forEach((value) => {
        const reference = db.collection(group.collection).doc();
        batch.set(reference, {
          id: reference.id,
          ...value,
          status: "published",
          visibility: "public",
          createdBy: admin.uid,
          createdAt: now,
          updatedAt: now,
        });
      });
    }

    await batch.commit();
    revalidateTag("public-content", "max");
    revalidatePath("/admin/profile");
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Profile could not be saved.",
    };
  }
}
