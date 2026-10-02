import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";
import { writeFileSync } from "node:fs";
loadEnvConfig(process.cwd());
async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const ref = db.collection("projects").doc("curated-fairpos");
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw Error("FairPOS not found");
    writeFileSync(
      "/tmp/pachpim-fairpos-before-removal.json",
      JSON.stringify(snap.data(), null, 2),
      { mode: 0o600 },
    );
    tx.update(ref, {
      status: "draft",
      visibility: "private",
      featured: false,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "script:user-requested-removal",
    });
  });
  console.log(
    "FairPOS removed from public portfolio and retained as a private draft.",
  );
}
main();
