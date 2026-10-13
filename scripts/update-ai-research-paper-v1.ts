import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

const oldPdfUrl =
  "/research/measuring-ai-performance-quality-cost-constraints.pdf";
const pdfUrl = `${oldPdfUrl}?v=1.0.0`;
const coverImageUrl = "/projects/ai-quality-cost-research.svg?v=1.0.0";
const companionUrl =
  "/research/ai-evaluation-model-selection-equations-explanations.pdf?v=1.0.0";

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const projectRef = db
    .collection("projects")
    .doc("research-ai-quality-cost-selection");
  const articleRef = db
    .collection("notes")
    .doc("research-explainer-ai-quality-cost");

  await db.runTransaction(async (tx) => {
    const [project, article] = await tx.getAll(projectRef, articleRef);
    if (!project.exists || !article.exists) {
      throw new Error("Research project or article is missing");
    }

    const body = String(article.get("body") ?? "");
    if (!body.includes(oldPdfUrl)) {
      throw new Error("Article does not contain the expected PDF link");
    }

    const updatedAt = FieldValue.serverTimestamp();
    tx.update(projectRef, {
      coverImageUrl,
      liveUrl: pdfUrl,
      supplementaryUrl: companionUrl,
      supplementaryLabel: "Equation explanations",
      metrics: [
        { label: "Author", value: "Pacharapol Pimpa" },
        { label: "Published", value: "11 Oct 2026" },
        { label: "Length", value: "24 pages" },
        { label: "Equation guide", value: "22 pages" },
        { label: "Research version", value: "1.0.0" },
      ],
      sources: [pdfUrl, companionUrl],
      updatedAt,
      updatedBy: "script:update-ai-research-paper-v1",
    });
    tx.update(articleRef, {
      body: body.replaceAll(oldPdfUrl, pdfUrl),
      coverImageUrl,
      sources: [pdfUrl],
      updatedAt,
      updatedBy: "script:update-ai-research-paper-v1",
    });
  });

  console.log("Updated research project and article to manuscript v1.0.0");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
