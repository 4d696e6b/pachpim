import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getPublicContent } from "@/lib/server/public-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/projects", "/notes", "/contact", "/skills"];
  const { projects, notes } = await getPublicContent();
  return [
    ...(routes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.8,
    })) as MetadataRoute.Sitemap),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...notes.map((note) => ({
      url: `${siteConfig.url}/notes/${note.slug}`,
      lastModified: new Date(note.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
