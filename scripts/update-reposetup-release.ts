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
        "An open-source development stack CLI and companion website for choosing tools, previewing plans, and creating projects with safer, explainable workflows.",
      description:
        "RepoSetup combines a terminal-first stack composer with a companion website at reposetupcli.com. Published on npm as rsetup, it helps developers understand integration choices, build versioned selections, inspect local installation plans, and create projects through bounded workflows.\n\nVersion 0.3.1 preserves the 0.3 beginner guide, qualified starters, declarative create/add selections, structural diff previews, and config-aware doctor workflow while fixing repeated no-op removal in JSON mode and keeping the website aligned with the published CLI artifact.",
      statusLabel: "Website + npm release · v0.3.1",
      coverImageUrl: "/projects/reposetup.svg?v=0.3.1",
      liveUrl: "https://reposetupcli.com/",
      challenge:
        "Setting up a development stack means reconciling unfamiliar tools, compatibility requirements, installation order, and local project state. Beginners need explanations before choosing, while experienced users need deterministic, inspectable plans that do not hide file changes or silently repair dependencies.",
      approach:
        "Keep configuration, registry resolution, planning, and execution separate. Derive beginner explanations and website choices from the same integration registry, transport selections through a versioned non-executable format, preview structural file changes without exposing secret contents, and require review before eligible repair or execution.",
      process:
        "Build the CLI as a TypeScript workspace with shared core, registry, integration, and command packages, then qualify the packed artifact across Ubuntu, macOS, and Windows. Test the companion website across five browser profiles, verify deployed public files and security headers, and keep integration maturity and deferred native screen-reader limits explicit.",
      outcome:
        "Published rsetup 0.3.1 and launched reposetupcli.com with documentation, an integration catalog, beginner guidance, and a local selection builder. The release retained three consecutive successful qualification waves with all 48 required jobs passing; published-mode website qualification passed 405 cases. Version 0.3.1 also fixes JSON output for repeated no-op removal while preserving files and avoiding prompts or installation commands.",
      metrics: [
        { label: "Distribution", value: "npm · rsetup" },
        { label: "Release", value: "0.3.1" },
        { label: "Website", value: "reposetupcli.com" },
        { label: "License", value: "MIT" },
      ],
      sources: [
        "https://github.com/4d696e6b/RepoSetup",
        "https://www.npmjs.com/package/rsetup",
        "https://github.com/4d696e6b/RepoSetup/releases/tag/v0.3.1",
        "https://reposetupcli.com/",
      ],
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "script:update-reposetup-release",
    });

  console.log("Updated RepoSetup project to release v0.3.1");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
