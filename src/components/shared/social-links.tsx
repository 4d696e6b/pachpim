import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Globe2,
  Mail,
  type LucideIcon,
} from "lucide-react";

import { isSafeUrl } from "@/lib/security";
import { cn } from "@/lib/utils";

export interface SocialLinkItem {
  label: string;
  url: string;
}

function iconForLink(label: string, url: string): LucideIcon {
  const haystack = `${label} ${url}`.toLowerCase();
  if (haystack.includes("github")) return Code2;
  if (haystack.includes("linkedin")) return BriefcaseBusiness;
  if (haystack.startsWith("mailto:") || /\bmail\b/.test(haystack)) return Mail;
  if (
    haystack.includes("instagram") ||
    haystack.includes("youtube") ||
    haystack.includes("twitter") ||
    haystack.includes("x.com")
  )
    return ArrowUpRight;
  return Globe2;
}

export function usableSocialLinks(links: SocialLinkItem[]) {
  return links.filter(
    (link) =>
      link.label.trim().length > 0 &&
      isSafeUrl(link.url, { allowedProtocols: ["https:", "http:", "mailto:"] }),
  );
}

export function SocialLinks({
  links,
  variant = "icons",
  className,
}: {
  links: SocialLinkItem[];
  variant?: "icons" | "list";
  className?: string;
}) {
  const items = usableSocialLinks(links);
  if (!items.length) return null;

  if (variant === "list") {
    return (
      <div className={cn("grid gap-3", className)}>
        {items.map((link) => {
          const Icon = iconForLink(link.label, link.url);
          return (
            <a
              className="btn-neon bg-background hover:text-accent inline-flex items-center gap-3 rounded-full px-3 py-1.5 text-sm"
              href={link.url}
              key={`${link.label}-${link.url}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <Icon className="size-4" />
              {link.label}
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {items.map((link) => {
        const Icon = iconForLink(link.label, link.url);
        return (
          <a
            aria-label={link.label}
            className="btn-neon bg-background text-muted-foreground hover:text-foreground grid size-10 place-items-center rounded-full"
            href={link.url}
            key={`${link.label}-${link.url}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Icon className="size-5" />
          </a>
        );
      })}
    </div>
  );
}
