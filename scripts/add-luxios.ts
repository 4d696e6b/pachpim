import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

const project = {
  id: "curated-luxios",
  slug: "luxios-vs-code-theme",
  title: "Luxios — VS Code theme family",
  excerpt:
    "A dark VS Code theme family built around deep navy surfaces, champagne-gold interaction cues, and focused syntax for modern development.",
  description:
    "Luxios is a released VS Code theme family designed to make long coding sessions feel calm, deliberate, and distinctive. It pairs deep navy editor surfaces with restrained champagne-gold interaction cues and clear syntax for TypeScript, React, and Python.\n\nThe project ships four variants — Luxios, Midnight, OLED, and Royale — with a consistent visual system across each one. It is distributed under the MIT license and currently available as version 0.1.6.",
  category: "Developer tooling",
  year: 2026,
  statusLabel: "Marketplace release · v0.1.6",
  technologies: ["VS Code", "JSON", "JavaScript", "TypeScript", "MIT"],
  coverImageUrl: "/projects/luxios.svg",
  gallery: [],
  liveUrl:
    "https://marketplace.visualstudio.com/items?itemName=4d696e6b.luxios",
  repositoryUrl: "https://github.com/4d696e6b/luxios",
  challenge:
    "Most editor themes either chase high contrast or decorative color without a durable visual system. Luxios needed to make a strong luxury-inspired palette readable across code, controls, focus states, and multiple display types.",
  approach:
    "Build around a restrained navy-and-champagne palette, then use the colors intentionally: muted gold frames controls, warmer gold marks selection, and brighter champagne gold communicates keyboard focus. Keep syntax familiar so the visual identity never harms code comprehension.",
  process:
    "Review TypeScript, React, and Python fixtures in VS Code, refine token scopes with the editor inspection tools, and package the theme as four variants. Document the testing record, release checklist, and the limits of what VS Code themes can control.",
  outcome:
    "Published Luxios 0.1.6 with four installable variants, an MIT license, documented validation, and a focused visual language for everyday coding and late-night sessions.",
  metrics: [
    { label: "Variants", value: "4 themes" },
    { label: "Release", value: "0.1.6" },
    { label: "License", value: "MIT" },
  ],
  featured: true,
  sortOrder: 2,
  sources: [
    "https://github.com/4d696e6b/luxios",
    "https://marketplace.visualstudio.com/items?itemName=4d696e6b.luxios",
  ],
};

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const ref = db.collection("projects").doc(project.id);
  const reservation = db
    .collection("slugReservations")
    .doc("project-" + project.slug);
  const [existing, reserved] = await Promise.all([
    ref.get(),
    reservation.get(),
  ]);

  if (existing.exists) throw new Error("Luxios project already exists");
  if (reserved.exists && reserved.get("entityId") !== project.id) {
    throw new Error("Luxios slug already belongs to another project");
  }

  const audit = {
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    createdBy: "script:add-luxios",
    updatedBy: "script:add-luxios",
  };

  await db.runTransaction(async (tx) => {
    tx.create(ref, {
      ...project,
      status: "published",
      visibility: "public",
      ...audit,
    });
    tx.create(reservation, {
      id: "project-" + project.slug,
      kind: "project",
      slug: project.slug,
      entityId: project.id,
      ...audit,
    });
  });

  console.log("Added " + project.title + " at /projects/" + project.slug);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
