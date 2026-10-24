import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

const certificate = {
  id: "discovery-piscine-web-programming-essentials",
  title: "Web Programming Essentials",
  issuer: "Discovery Piscine · 42 Bangkok KMITL",
  date: "12–16 October 2026",
  imageUrl:
    "/certificates/discovery-piscine-web-programming-essentials.png?v=2026-10-25",
};

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const certificateRef = db.collection("certifications").doc(certificate.id);
  const existing = await certificateRef.get();
  const now = FieldValue.serverTimestamp();

  await certificateRef.set(
    {
      ...certificate,
      url: certificate.imageUrl,
      sortOrder: -1,
      status: "published",
      visibility: "public",
      createdAt: existing.exists ? existing.get("createdAt") : now,
      createdBy: existing.exists
        ? existing.get("createdBy")
        : "script:add-discovery-piscine-certificate",
      updatedAt: now,
      updatedBy: "script:add-discovery-piscine-certificate",
    },
    { merge: true },
  );

  console.log("Added the Discovery Piscine certificate to the profile");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
