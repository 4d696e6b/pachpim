import Link from "next/link";

import {
  SocialLinks,
  type SocialLinkItem,
} from "@/components/shared/social-links";

export function SiteFooter({
  name,
  tagline,
  latestUpdate,
  socialLinks,
}: {
  name: string;
  tagline?: string;
  latestUpdate?: string;
  socialLinks: SocialLinkItem[];
}) {
  const brandName = name.trim() || "Portfolio";
  const updateLabel = latestUpdate?.trim();

  return (
    <footer className="border-border border-t">
      <div className="container flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{brandName}</p>
          {tagline?.trim() ? (
            <p className="text-muted-foreground mt-1 text-sm">{tagline}</p>
          ) : null}
          {updateLabel ? (
            <p className="text-muted-foreground mt-1 text-xs">{updateLabel}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <SocialLinks links={socialLinks} />
          <Link
            className="text-muted-foreground hover:text-foreground text-sm"
            href="/login"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
