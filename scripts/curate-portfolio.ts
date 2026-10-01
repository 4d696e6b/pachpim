import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";
import { writeFileSync } from "node:fs";
loadEnvConfig(process.cwd());
const projects = [
  {
    id: "curated-reposetup",
    slug: "reposetup-development-stack-cli",
    title: "RepoSetup — development stack CLI",
    excerpt:
      "An open-source CLI for composing development stacks, checking compatibility, and previewing installation plans before changing a project.",
    description:
      "RepoSetup turns a declarative configuration into a typed installation plan. Published on npm as rsetup, it brings stack composition, compatibility checks, and setup tooling into a terminal workflow.\n\nThis is an early-stage open-source release. Integration maturity varies, and the project documents its current verification limits.",
    category: "Developer tooling",
    year: 2026,
    statusLabel: "Early release · npm",
    technologies: ["TypeScript", "Node.js", "Commander", "Vitest", "pnpm"],
    coverImageUrl: "/projects/reposetup.svg",
    gallery: [],
    liveUrl: "https://www.npmjs.com/package/rsetup",
    repositoryUrl: "https://github.com/4d696e6b/RepoSetup",
    challenge:
      "Setting up a development stack involves reconciling instructions, compatibility requirements, and installation order across multiple tools. A setup assistant also needs to make its proposed changes understandable before executing them.",
    approach:
      "Separate configuration, integration resolution, planning, and execution. A local registry describes supported tools, while typed operations provide an inspectable boundary between deciding what should happen and modifying a project.",
    process:
      "Build a TypeScript workspace with separate core, registry, integration, and CLI packages. Provide interactive and configuration-driven workflows, existing-project detection, and health checks. Use the same planner for dry runs and execution, then document which integration recipes have been verified.",
    outcome:
      "Released rsetup 0.1.1 on npm with create, add, remove, search, stack, doctor, and export workflows. The repository includes tests and records integration maturity explicitly; no integration is labeled stable in this release.",
    metrics: [
      { label: "Distribution", value: "npm · rsetup" },
      { label: "Release", value: "0.1.1" },
      { label: "License", value: "MIT" },
    ],
    featured: true,
    sortOrder: 1,
    sources: [
      "https://github.com/4d696e6b/RepoSetup",
      "https://www.npmjs.com/package/rsetup",
    ],
  },
  {
    id: "curated-fairpos",
    slug: "fairpos-event-point-of-sale",
    title: "FairPOS — event point of sale",
    excerpt:
      "A collaborative web application connecting event-booth ordering, kitchen queues, menu management, and sales in one workflow.",
    description:
      "FairPOS is a web-based point-of-sale project designed for school fairs, university events, food festivals, and temporary restaurants. It connects the front counter with kitchen and shop-management workflows.\n\nI contributed to this collaborative project alongside another repository contributor. The case study describes the product as documented in its repository, without claiming individual ownership of every feature.",
    category: "Product engineering",
    year: 2026,
    statusLabel: "Collaborative project",
    technologies: [
      "TypeScript",
      "Next.js",
      "React",
      "Firebase",
      "Tailwind CSS",
    ],
    coverImageUrl: "/projects/fairpos.svg",
    gallery: [],
    liveUrl: "https://fair-pos-theta.vercel.app",
    repositoryUrl: "https://github.com/4d696e6b/fair_pos",
    challenge:
      "Temporary food-service teams need to coordinate orders, menu availability, kitchen progress, and sales without fragmenting the workflow across separate tools.",
    approach:
      "Organize the product around the counter, kitchen, and operations. Use a shared web application to connect order entry with preparation status and administrative views.",
    process:
      "Collaborate on a TypeScript and Next.js application backed by Firebase. The documented feature set covers menu, order, table, shop, and sales management, with dedicated kitchen and employee-management views.",
    outcome:
      "The repository provides an implemented point-of-sale application and a linked web deployment. Its documentation shows ordering, bill management, a kitchen queue, employee roles, and financial views. No adoption or revenue figures are claimed.",
    metrics: [
      { label: "Delivery", value: "Web application" },
      { label: "Work", value: "Team collaboration" },
    ],
    featured: true,
    sortOrder: 2,
    sources: [
      "https://github.com/4d696e6b/fair_pos",
      "https://api.github.com/repos/4d696e6b/fair_pos/contributors",
    ],
  },
];
async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const experience = {
    id: "curated-reposetup-maintainer",
    title: "Open-source Developer",
    organization: "RepoSetup / rsetup",
    period: "September 2026",
    description:
      "Built and published an early-stage TypeScript CLI for composing development stacks, validating compatibility, and previewing installation plans. Organized the project around a typed planner, a local integration registry, and explicit maturity documentation.",
    type: "experience",
    sortOrder: -1,
    status: "published",
    visibility: "public",
    sources: [
      "https://github.com/4d696e6b/RepoSetup",
      "https://www.npmjs.com/package/rsetup",
    ],
  };
  const refs = [
    ...projects.map((p) => db.collection("projects").doc(p.id)),
    db.collection("experiences").doc(experience.id),
  ];
  const before = await db.getAll(...refs);
  const backupPath = `/tmp/pachpim-curation-${Date.now()}.json`;
  writeFileSync(
    backupPath,
    JSON.stringify(
      before.map((d) => ({
        path: d.ref.path,
        exists: d.exists,
        data: d.data() ?? null,
      })),
      null,
      2,
    ),
    { mode: 0o600 },
  );
  if (!process.argv.includes("--apply")) {
    console.log(
      JSON.stringify({
        mode: "preview",
        projects: projects.map((p) => p.title),
        experience: experience.title,
        backupPath,
      }),
    );
    return;
  }
  await db.runTransaction(async (tx) => {
    const snapshots = await tx.getAll(
      ...refs,
      ...projects.map((p) =>
        db.collection("slugReservations").doc(`project-${p.slug}`),
      ),
    );
    for (let i = 0; i < projects.length; i++) {
      const reserved = snapshots[refs.length + i];
      if (reserved.exists && reserved.get("entityId") !== projects[i].id)
        throw new Error("Slug already belongs to another project");
    }
    const audit = (index: number) => ({
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "script:curated-portfolio",
      ...(!snapshots[index].exists
        ? {
            createdAt: FieldValue.serverTimestamp(),
            createdBy: "script:curated-portfolio",
          }
        : {}),
    });
    projects.forEach((p, i) => {
      if (snapshots[i].exists)
        throw new Error(
          "Curated project already exists; refusing to overwrite edits",
        );
      tx.set(refs[i], {
        ...p,
        status: "published",
        visibility: "public",
        ...audit(i),
      });
      tx.set(db.collection("slugReservations").doc(`project-${p.slug}`), {
        id: `project-${p.slug}`,
        kind: "project",
        slug: p.slug,
        entityId: p.id,
        ...audit(i),
      });
    });
    if (snapshots[2].exists)
      throw new Error("Curated experience already exists");
    tx.set(refs[2], { ...experience, ...audit(2) });
  });
  const after = await db.getAll(...refs);
  console.log(
    JSON.stringify({
      written: after.map((d) => ({
        path: d.ref.path,
        title: d.get("title"),
        status: d.get("status"),
      })),
      backupPath,
    }),
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
