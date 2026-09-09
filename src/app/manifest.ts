import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { profile } = await getPublicContent();
  const identity = siteIdentity(profile);

  return {
    name: identity.title
      ? `${identity.name} — ${identity.title}`
      : identity.name,
    short_name: siteConfig.shortName,
    description: identity.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#147d64",
  };
}
