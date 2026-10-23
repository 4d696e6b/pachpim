import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

const resumeUrl = "/resume/pacharapol-pimpa-resume.pdf?v=2026-10-23";

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const profileRef = db.collection("profile").doc("public");
  const profile = await profileRef.get();

  if (!profile.exists) {
    throw new Error("Public profile is missing");
  }

  await profileRef.update({
    resumeUrl,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "script:update-resume",
  });

  console.log(`Updated the public resume URL to ${resumeUrl}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
