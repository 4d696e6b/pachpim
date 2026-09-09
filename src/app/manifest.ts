import type { MetadataRoute } from "next";

import { getPublicContent, siteIdentity } from "@/lib/server/public-content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { profile } = await getPublicContent();
  const identity = siteIdentity(profile);

  return {
    name: identity.title
      ? `${identity.name} — ${identity.title}`
      : `${identity.name} — Portfolio`,
    short_name: identity.name,
    description: identity.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#147d64",
  };
}
