import { notFound } from "next/navigation";

import { ProjectForm } from "@/features/projects/project-form";
import type { ProjectFormValues } from "@/features/projects/project-form-schema";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snapshot = await getAdminFirestore()
    .collection("projects")
    .doc(id)
    .get();
  if (!snapshot.exists) notFound();
  const data = snapshot.data()!;
  const values: ProjectFormValues = {
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    excerpt: String(data.excerpt ?? ""),
    description: String(data.description ?? ""),
    category: String(data.category ?? ""),
    year: Number(data.year ?? new Date().getFullYear()),
    status: data.status === "published" ? "published" : "draft",
    featured: Boolean(data.featured),
    sortOrder: Number(data.sortOrder ?? 0),
    technologies: Array.isArray(data.technologies)
      ? data.technologies.join(", ")
      : "",
    statusLabel: String(data.statusLabel ?? "In progress"),
    coverImageUrl: String(data.coverImageUrl ?? ""),
    gallery: Array.isArray(data.gallery) ? data.gallery.join("\n") : "",
    liveUrl: String(data.liveUrl ?? ""),
    repositoryUrl: String(data.repositoryUrl ?? ""),
    challenge: String(data.challenge ?? ""),
    approach: String(data.approach ?? ""),
    process: String(data.process ?? ""),
    outcome: String(data.outcome ?? ""),
    metrics: Array.isArray(data.metrics)
      ? data.metrics
          .map(
            (metric: { label: string; value: string }) =>
              `${metric.label}: ${metric.value}`,
          )
          .join("\n")
      : "",
  };

  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Projects</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Edit project
      </h1>
      <p className="text-muted-foreground mt-2">
        Changes to published projects appear after save.
      </p>
      <div className="mt-8">
        <ProjectForm id={id} initialValues={values} />
      </div>
    </div>
  );
}
