import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();

  await db.collection("projects").doc("curated-luxios").update({
    coverImageUrl: "/projects/luxios.svg?crown=1",
  });

  console.log("Updated Luxios cover URL with cache-busting asset version");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
