import { loadEnvConfig } from "@next/env";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { writeFileSync } from "node:fs";
loadEnvConfig(process.cwd());
const posts = [
  {
    id: "linkedin-tech-talks-2026",
    slug: "line-man-wongnai-tech-talks-2026",
    title: "Learning from real-world mobile systems",
    category: "Learning",
    date: "2026-09-25",
    excerpt:
      "At LINE MAN Wongnai Tech Talks 2026, I explored mobile testing and automation across iOS and Android with people building real-world systems.",
    body: "I attended LINE MAN Wongnai Tech Talks 2026 to learn more about mobile testing and automation across iOS and Android.\n\nHearing how engineers approach real-world systems gave me a closer look at the work behind reliable mobile experiences. It was also a chance to learn from the wider tech community.\n\nThank you to LINE MAN Wongnai for sharing that knowledge.",
    tags: ["Software engineering", "Mobile testing"],
    source:
      "https://www.linkedin.com/feed/update/urn:li:activity:7509294612352651264/",
  },
  {
    id: "linkedin-google-ambassador-2026",
    slug: "joining-google-student-ambassador",
    title: "Joining Google Student Ambassador",
    category: "Milestone",
    date: "2026-09-24",
    excerpt:
      "A new chapter in the student community: I’ve joined the Google Student Ambassador program to learn, connect, and get involved.",
    body: "I’ve joined the Google Student Ambassador program.\n\nI’m looking forward to meeting new people, learning more about Google technologies, and getting involved in activities with the student community. There is plenty to learn, and I’m excited to see where this experience takes me.",
    tags: ["Student community", "Google Student Ambassador"],
    source:
      "https://www.linkedin.com/feed/update/urn:li:activity:7508847872637935616/",
  },
  {
    id: "linkedin-rsetup-launch-2026",
    slug: "launching-rsetup-open-source",
    title: "My first open-source developer tool",
    category: "Announcement",
    date: "2026-09-22",
    excerpt:
      "I published RSetup, a terminal-first tool that brings development-stack setup into one workflow. Version 0.1.1 is the beginning.",
    body: "RSetup started with a frustration: setting up a project often means jumping between documentation for frameworks, styling, databases, and testing before any actual building begins.\n\nI built a terminal-first tool to bring those choices together, check compatibility, and preview the planned changes before configuring a project. On September 22, 2026, I shared the early 0.1.1 release.\n\nThe project taught me about CLI design, dependency resolution, safe command execution, testing, and package publishing. There is still more to improve, but publishing something others can install was a meaningful milestone.\n\n[Explore the project](/projects/reposetup-development-stack-cli) · [View rsetup on npm](https://www.npmjs.com/package/rsetup)",
    tags: ["Open source", "Developer tools"],
    source:
      "https://www.linkedin.com/feed/update/urn:li:activity:7508002635069677568/",
  },
];
async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const refs = posts.map((p) => db.collection("notes").doc(p.id));
  const snapshots = await db.getAll(...refs);
  writeFileSync(
    "/tmp/pachpim-experience-before-import.json",
    JSON.stringify(
      snapshots.map((s) => ({ path: s.ref.path, data: s.data() ?? null })),
      null,
      2,
    ),
    { mode: 0o600 },
  );
  if (!process.argv.includes("--apply")) {
    console.log(
      JSON.stringify(
        posts.map(({ title, date, source }) => ({ title, date, source })),
      ),
    );
    return;
  }
  await db.runTransaction(async (tx) => {
    const existing = await tx.getAll(
      ...refs,
      ...posts.map((p) =>
        db.collection("slugReservations").doc(`note-${p.slug}`),
      ),
    );
    posts.forEach((post, i) => {
      if (existing[i].exists)
        throw Error("Post already exists; refusing to overwrite");
      const reserved = existing[posts.length + i];
      if (reserved.exists && reserved.get("entityId") !== post.id)
        throw Error("Slug is already reserved");
    });
    const audit = {
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: "script:linkedin-highlights",
      updatedBy: "script:linkedin-highlights",
    };
    posts.forEach((post, i) => {
      const body = `${post.body}\n\n[Original LinkedIn post](${post.source})`;
      tx.set(refs[i], {
        id: post.id,
        slug: post.slug,
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        body,
        tags: post.tags,
        status: "published",
        visibility: "public",
        publishedAt: Timestamp.fromDate(new Date(`${post.date}T05:00:00Z`)),
        readingTime: Math.max(1, Math.ceil(body.split(/\s+/).length / 220)),
        coverImageUrl: null,
        sources: [post.source],
        ...audit,
      });
      tx.set(db.collection("slugReservations").doc(`note-${post.slug}`), {
        id: `note-${post.slug}`,
        kind: "note",
        slug: post.slug,
        entityId: post.id,
        ...audit,
      });
    });
  });
  console.log(
    JSON.stringify({
      published: (await db.getAll(...refs)).map((s) => ({
        title: s.get("title"),
        status: s.get("status"),
      })),
    }),
  );
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
