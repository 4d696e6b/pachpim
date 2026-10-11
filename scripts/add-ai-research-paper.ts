import { loadEnvConfig } from "@next/env";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

const project = {
  id: "research-ai-quality-cost-selection",
  slug: "measuring-ai-performance-quality-cost-constraints",
  title:
    "Measuring AI Performance and Selecting Models Under Quality and Cost Constraints",
  excerpt:
    "A task-conditioned framework for selecting the least-cost AI configuration only after quality, evidence, budget, and resource requirements are satisfied.",
  description:
    "This independent research manuscript proposes a unified, task-conditioned framework for AI configuration selection. It connects task-specific quality measurement, complete operational cost estimation, uncertainty-aware admissibility, and least-cost optimization in one decision process.\n\nThe paper also preserves a completed Azure study on Dry Bean classification and sequential Bike Sharing forecasting. Those experiments provide evidence about reproducibility and selection trade-offs, but they do not validate the proposed optimizer or establish financial savings.",
  category: "AI research",
  year: 2026,
  statusLabel: "Independent research manuscript — not peer reviewed.",
  technologies: [
    "AI evaluation",
    "Model selection",
    "Python",
    "Azure ML",
    "Statistical inference",
  ],
  coverImageUrl: "/projects/ai-quality-cost-research.svg?v=1",
  gallery: [],
  liveUrl: "/research/measuring-ai-performance-quality-cost-constraints.pdf",
  liveLabel: "Read paper / Download PDF",
  repositoryUrl: null,
  author: "Pacharapol Pimpa",
  publishedAt: Timestamp.fromDate(new Date("2026-10-10T17:00:00.000Z")),
  challenge:
    "AI comparisons often rank candidates by one benchmark score or a partial inference price. A deployment decision also needs an explicit acceptable-quality floor, evidence about degradation from a reference, complete policy costs, and hard operational limits. Missing or incompatible evidence must remain visible instead of being filled with optimistic assumptions.",
  approach:
    "Proposed framework — not yet empirically validated: represent every model, inference mode, prompt, retry, verification, routing, and execution rule as one immutable configuration. Admit a configuration only when its evidence supports an absolute quality floor, a reference-relative non-inferiority margin, a budget bound, and every declared resource limit. Among the admitted configurations, select the one with the lowest projected total cost; if none qualify, return no supported selection.",
  process:
    "Completed experiments: the supporting Azure study evaluated a different, hard-gated weighted selector across Dry Bean classification and one-hour-ahead Bike Sharing forecasting. It used grouped or chronological held-out partitions, bounded model families, isolated resource profiling, 20,000-draw primary bootstrap analyses, a separate 40,000-draw endpoint check, and a fresh cloud refit with consistency auditing. These experiments test weighted pipeline selection and reproducibility, not the proposed confidence-bound optimizer.",
  outcome:
    "Completed findings: the weighted rule selected linear models for both Bean profiles and histogram boosting for both Bike profiles. In the Bike quality profile, boosting produced 7.5731 more simulated weighted-count loss units per hour than linear, with an adjusted conditional interval of [3.0698, 12.1578]. Other primary comparisons were identical, inconclusive, or missed a declared precision target.\n\nFramework status: the paper does not claim that the proposed optimizer preserves quality while reducing cost. That question remains open and is assigned to a prospective Python code-generation study with independent development, selection, and held-out sets, supported model-effort configurations, paired quality assessment, and complete cost accounting.",
  metrics: [
    { label: "Author", value: "Pacharapol Pimpa" },
    { label: "Published", value: "11 Oct 2026" },
    { label: "Length", value: "22 pages" },
    { label: "Completed study", value: "2 tasks" },
  ],
  featured: true,
  sortOrder: 0,
  sources: ["/research/measuring-ai-performance-quality-cost-constraints.pdf"],
};

const article = {
  id: "research-explainer-ai-quality-cost",
  slug: "choosing-ai-models-under-quality-and-cost-constraints",
  title: "Choosing AI models when quality and cost both matter",
  excerpt:
    "A plain-language explanation of why the cheapest AI model is not automatically usable, why the highest score is not automatically practical, and how evidence can connect the two.",
  category: "Learning",
  tags: ["AI evaluation", "Model selection", "Research"],
  coverImageUrl: "/projects/ai-quality-cost-research.svg?v=1",
  publishedAt: Timestamp.fromDate(new Date("2026-10-10T17:00:00.000Z")),
  body: `Most AI comparisons start with a leaderboard: which model received the highest score? Real deployment decisions are harder. The best-scoring option may exceed the budget or latency limit, while the cheapest option may fail too often to be useful.

My paper, **Measuring AI Performance and Selecting Models Under Quality and Cost Constraints**, asks how to make that trade-off explicit and reviewable.

## The decision in simple terms

The proposed framework follows four steps:

1. Measure quality using a metric that matches the actual task.
2. Estimate the complete operational cost for the intended workload.
3. Reject configurations that lack enough evidence or fail quality, budget, latency, memory, or other mandatory limits.
4. Among the remaining configurations, choose the one with the lowest projected total cost.

If nothing meets the requirements, the correct result is **no supported selection**. The framework does not silently lower the quality requirement or invent missing evidence to force a winner.

A “configuration” means more than a model name. It includes the model version, inference mode, prompt or preprocessing, output limits, retries, verification, routing, tools, backend, and resource allocation. Those choices can change both quality and cost.

## What I completed

The paper preserves a completed Azure experiment on two predictive tasks: Dry Bean classification and sequential Bike Sharing forecasting. That study evaluated a hard-gated weighted selector across linear, random-forest, and histogram-boosting pipelines.

The weighted rule selected linear models for both Bean profiles and boosting for both Bike profiles. The result was not a simple success story. In the Bike quality profile, the boosting choice had higher held-out underprediction-heavy simulated loss than linear. Other comparisons were identical, inconclusive, or failed a declared precision target.

That is useful evidence because it shows why a development score or weighted preference is not enough. A model can look better on one predictive metric and still perform worse under the operational loss that matters for the scenario.

## What remains proposed

The least-cost, confidence-bound framework is a proposal. The completed experiments did **not** apply that optimizer, test model thinking modes, or demonstrate equal-quality financial savings.

The paper therefore specifies a separate prospective study using Python code-generation tasks, independent development, selection, and held-out sets, supported model-effort configurations, paired quality assessment, and complete cost accounting. Until that study is run, the main question remains open: can the framework reduce complete cost while preserving acceptable quality?

This distinction matters to me. A research page should make completed evidence easy to inspect while keeping future validation clearly labeled.

[Explore the research project](/projects/measuring-ai-performance-quality-cost-constraints) · [Read the full paper](/research/measuring-ai-performance-quality-cost-constraints.pdf)`,
};

async function main() {
  const { getAdminFirestore } =
    await import("../src/lib/server/firebase-admin");
  const db = getAdminFirestore();
  const projectRef = db.collection("projects").doc(project.id);
  const articleRef = db.collection("notes").doc(article.id);
  const projectSlugRef = db
    .collection("slugReservations")
    .doc(`project-${project.slug}`);
  const articleSlugRef = db
    .collection("slugReservations")
    .doc(`note-${article.slug}`);

  await db.runTransaction(async (tx) => {
    const [projectDoc, articleDoc, projectSlug, articleSlug] = await tx.getAll(
      projectRef,
      articleRef,
      projectSlugRef,
      articleSlugRef,
    );

    if (projectDoc.exists || articleDoc.exists) {
      throw new Error("Research project or article already exists");
    }
    if (
      (projectSlug.exists && projectSlug.get("entityId") !== project.id) ||
      (articleSlug.exists && articleSlug.get("entityId") !== article.id)
    ) {
      throw new Error("A research slug is already reserved");
    }

    const audit = {
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: "script:add-ai-research-paper",
      updatedBy: "script:add-ai-research-paper",
    };
    const readingTime = Math.max(
      1,
      Math.ceil(article.body.split(/\s+/).length / 220),
    );

    tx.create(projectRef, {
      ...project,
      status: "published",
      visibility: "public",
      ...audit,
    });
    tx.create(articleRef, {
      ...article,
      status: "published",
      visibility: "public",
      readingTime,
      sources: [
        "/research/measuring-ai-performance-quality-cost-constraints.pdf",
      ],
      ...audit,
    });
    tx.create(projectSlugRef, {
      id: `project-${project.slug}`,
      kind: "project",
      slug: project.slug,
      entityId: project.id,
      ...audit,
    });
    tx.create(articleSlugRef, {
      id: `note-${article.slug}`,
      kind: "note",
      slug: article.slug,
      entityId: article.id,
      ...audit,
    });
  });

  console.log(
    `Published /projects/${project.slug} and /experience/${article.slug}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
