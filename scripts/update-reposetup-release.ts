import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();

  await db
    .collection("projects")
    .doc("curated-reposetup")
    .update({
      excerpt:
        "A terminal-first stack composer and installer with compatibility checks, setup plans, and recovery guidance.",
      description:
        "RepoSetup turns a declarative configuration into a typed installation plan. Published on npm as rsetup, it brings stack composition, compatibility checks, and setup tooling into a terminal workflow.\n\nVersion 0.2.3 improves generated-project reliability, database setup guidance, npm recovery diagnostics, and live acceptance coverage while documenting the integrations and environments that remain outside its qualification boundary.",
      statusLabel: "Public release · v0.2.3",
      coverImageUrl: "/projects/reposetup.svg?v=0.2.3",
      outcome:
        "Released rsetup 0.2.3 on npm with create, add, remove, search, stack, doctor, and export workflows. The release adds stronger generated-project checks for Prisma, Drizzle, SQLAlchemy, and Mongoose, clearer PostgreSQL and Docker guidance, and bounded, redacted recovery diagnostics. Integration maturity remains documented rather than overstated.",
      metrics: [
        { label: "Distribution", value: "npm · rsetup" },
        { label: "Release", value: "0.2.3" },
        { label: "License", value: "MIT" },
      ],
      sources: [
        "https://github.com/4d696e6b/RepoSetup",
        "https://www.npmjs.com/package/rsetup",
        "https://github.com/4d696e6b/RepoSetup/releases/tag/v0.2.3",
        "https://github.com/4d696e6b/RepoSetup/blob/main/docs/specification-documentation/release-docs/STABLE_RELEASE_0.2.3.md",
      ],
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "script:update-reposetup-release",
    });

  console.log("Updated RepoSetup project to release v0.2.3");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
