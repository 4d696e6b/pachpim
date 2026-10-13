import { loadEnvConfig } from "@next/env";
import { FieldValue } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

const companionUrl =
  "/research/ai-evaluation-model-selection-equations-explanations.pdf?v=1.0.0";
const projectId = "research-ai-quality-cost-selection";
const articleId = "research-explainer-ai-quality-cost";

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const projectRef = db.collection("projects").doc(projectId);
  const articleRef = db.collection("notes").doc(articleId);

  await db.runTransaction(async (tx) => {
    const [project, article] = await tx.getAll(projectRef, articleRef);
    if (!project.exists || !article.exists) {
      throw new Error("Research project or article is missing");
    }

    const currentBody = String(article.get("body") ?? "");
    const companionLink = `[Read the equation explanations](${companionUrl})`;
    const body = currentBody.includes(companionUrl)
      ? currentBody
      : `${currentBody} · ${companionLink}`;
    const mainPaperUrl = String(project.get("liveUrl") ?? "");

    tx.update(projectRef, {
      supplementaryUrl: companionUrl,
      supplementaryLabel: "Equation explanations",
      metrics: [
        { label: "Author", value: "Pacharapol Pimpa" },
        { label: "Published", value: "11 Oct 2026" },
        { label: "Main paper", value: "24 pages" },
        { label: "Equation guide", value: "22 pages" },
        { label: "Research version", value: "1.0.0" },
      ],
      sources: [mainPaperUrl, companionUrl].filter(Boolean),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "script:add-ai-equations-companion",
    });
    tx.update(articleRef, {
      body,
      sources: [mainPaperUrl, companionUrl].filter(Boolean),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "script:add-ai-equations-companion",
    });
  });

  console.log("Added the AI equations companion to the research project");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
