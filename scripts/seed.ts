#!/usr/bin/env tsx

import { loadEnvConfig } from "@next/env";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import {
  SAMPLE_NOTES,
  SAMPLE_PROFILE,
  SAMPLE_PROJECTS,
  SAMPLE_SITE_SETTINGS,
  SAMPLE_SKILLS,
  SAMPLE_TIMELINE_ENTRIES,
} from "../src/data/sample-content";

async function main(): Promise<void> {
  loadEnvConfig(process.cwd());
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const actorId = process.env.SEED_ACTOR_ID ?? "script:seed";
  const batch = db.batch();
  const audit = () => ({
    createdBy: actorId,
    createdAt: FieldValue.serverTimestamp(),
    updatedBy: actorId,
    updatedAt: FieldValue.serverTimestamp(),
  });

  batch.set(db.collection("profile").doc("public"), {
    id: "public",
    name: SAMPLE_PROFILE.name,
    professionalTitle: SAMPLE_PROFILE.headline,
    shortIntroduction: SAMPLE_PROFILE.shortBio,
    biography: SAMPLE_PROFILE.bio,
    location: SAMPLE_PROFILE.location,
    email: SAMPLE_PROFILE.email,
    profilePhotoUrl: null,
    resumeUrl: null,
    availability: "Sample availability — replace from the dashboard",
    socialLinks: SAMPLE_PROFILE.socialLinks.map(({ label, url }) => ({
      label,
      url,
    })),
    status: "published",
    visibility: "public",
    ...audit(),
  });
  batch.set(db.collection("siteSettings").doc("public"), {
    id: "public",
    ...SAMPLE_SITE_SETTINGS,
    status: "published",
    visibility: "public",
    ...audit(),
  });
  SAMPLE_SKILLS.forEach(({ id, data }) => {
    batch.set(db.collection("skills").doc(id), {
      id,
      name: data.name,
      category: data.category,
      sortOrder: data.order,
      status: "published",
      visibility: "public",
      ...audit(),
    });
  });
  SAMPLE_TIMELINE_ENTRIES.forEach(({ id, data }) => {
    batch.set(db.collection("experiences").doc(id), {
      id,
      title: data.role,
      organization: data.company,
      period: `${data.startDate.slice(0, 4)} — ${data.current ? "Present" : data.endDate?.slice(0, 4)}`,
      description: data.summary,
      type: "experience",
      sortOrder: data.order,
      status: "published",
      visibility: "public",
      ...audit(),
    });
  });
  SAMPLE_PROJECTS.forEach(({ id, data }) => {
    const year =
      data.publishedAt?.getUTCFullYear() ?? new Date().getUTCFullYear();
    const live = data.links.find((link) => link.kind === "live");
    const source = data.links.find((link) => link.kind === "source");
    batch.set(db.collection("projects").doc(id), {
      id,
      slug: data.slug,
      title: data.title,
      excerpt: `Sample project — ${data.summary}`,
      description: data.description,
      category: "Product engineering",
      year,
      technologies: data.technologies,
      featured: data.featured,
      sortOrder: data.order,
      status: data.status,
      visibility: data.status === "published" ? "public" : "private",
      statusLabel: "Sample project",
      coverImageUrl: null,
      gallery: [],
      liveUrl: live?.url ?? null,
      repositoryUrl: source?.url ?? null,
      challenge:
        "This sample brief represents a complex workflow that needed a clearer, more dependable experience.",
      approach:
        "Frame the riskiest assumptions, simplify the information model, and prototype the critical journey.",
      process:
        "This sample process combines discovery, accessible interaction design, typed implementation, and validation.",
      outcome:
        "A clearly labeled sample outcome. Replace it with verified results and evidence from your own work.",
      metrics: [],
      publishedAt: data.publishedAt
        ? Timestamp.fromDate(data.publishedAt)
        : null,
      ...audit(),
    });
    batch.set(db.collection("slugReservations").doc(`project-${data.slug}`), {
      id: `project-${data.slug}`,
      kind: "project",
      slug: data.slug,
      entityId: id,
      ...audit(),
    });
  });
  SAMPLE_NOTES.forEach(({ id, data }) => {
    batch.set(db.collection("notes").doc(id), {
      id,
      slug: data.slug,
      title: data.title,
      excerpt: `Sample note — ${data.excerpt}`,
      body: data.content.replace(/^# /gm, "## "),
      category: "Engineering",
      tags: data.tags,
      coverImageUrl: null,
      status: data.status,
      visibility: data.status === "published" ? "public" : "private",
      readingTime: data.readingTimeMinutes,
      publishedAt: data.publishedAt
        ? Timestamp.fromDate(data.publishedAt)
        : null,
      ...audit(),
    });
    batch.set(db.collection("slugReservations").doc(`note-${data.slug}`), {
      id: `note-${data.slug}`,
      kind: "note",
      slug: data.slug,
      entityId: id,
      ...audit(),
    });
  });

  await batch.commit();

  console.log(
    `Seeded sample content: ${SAMPLE_PROJECTS.length} projects, ` +
      `${SAMPLE_SKILLS.length} skills, ${SAMPLE_TIMELINE_ENTRIES.length} ` +
      `timeline entries, and ${SAMPLE_NOTES.length} notes.`,
  );
}

main().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
