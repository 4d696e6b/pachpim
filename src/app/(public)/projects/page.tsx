import type { Metadata } from "next";
import { CollectionHeading } from "@/components/shared/collection-heading";

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
      <CollectionHeading
        eyebrow="Projects"
        title="Ideas turned into working products."
        description="A closer look at the problems, decisions, and details behind the things I build."
        count={projects.length}
        unit="projects"
      />
      <div className="mt-12">
        <ProjectBrowser projects={projects} />
      </div>
    </section>
  );
}
