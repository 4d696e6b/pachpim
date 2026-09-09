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
  const { projects, profile } = await getPublicContent();
  return (
    <section className="section container">
      <p className="eyebrow">Projects</p>
      <h1 className="display mt-6 max-w-4xl">Work</h1>
      {profile.shortIntroduction ? (
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
          {profile.shortIntroduction}
        </p>
      ) : null}
      <div className="mt-12">
        <ProjectBrowser projects={projects} />
      </div>
    </section>
  );
}
