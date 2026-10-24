import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

const certificateId = "PZotTsjiCGsZyYlmBkZd";
const certificateUrl =
  "/certificates/basic-programming-bootcamp.pdf?v=2026-10-24";
const certificateImageUrl =
  "/certificates/basic-programming-bootcamp.png?v=2026-10-24";

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const certificateRef = db.collection("certifications").doc(certificateId);
  const certificate = await certificateRef.get();

  if (!certificate.exists) {
    throw new Error("Basic Programming certificate is missing");
  }

  await certificateRef.update({
    title: "Basics of Programming",
    issuer: "TechUp",
    url: certificateUrl,
    imageUrl: certificateImageUrl,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "script:update-basic-programming-certificate",
  });

  console.log("Updated the TechUp certificate with the corrected name");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
