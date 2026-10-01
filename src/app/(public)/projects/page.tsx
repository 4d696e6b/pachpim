import type { Metadata } from "next";

import { ProjectBrowser } from "@/features/projects/project-browser";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPublicContent();
  return {
    title: "Projects",
    description: siteIdentity(profile).description,
    alternates: { canonical: "/projects" },
  };
}

export default async function ProjectsPage() {
  const { projects } = await getPublicContent();
  return (
    <section className="section container">
      <p className="eyebrow">Projects</p>
      <h1 className="page-title mt-6 max-w-4xl">Selected work</h1>
      <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
        Case studies covering the problem, technical decisions, delivery
        process, and result behind each project.
      </p>
      <div className="mt-12">
        <ProjectBrowser projects={projects} />
      </div>
    </section>
  );
}
