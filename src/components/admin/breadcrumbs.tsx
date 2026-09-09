"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const parts = usePathname().split("/").filter(Boolean);
  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-muted-foreground flex items-center gap-1 text-sm">
        {parts.map((part, index) => {
          const href = `/${parts.slice(0, index + 1).join("/")}`;
          const current = index === parts.length - 1;
          return (
            <li className="flex items-center gap-1" key={href}>
              {index > 0 ? (
                <ChevronRight aria-hidden className="size-3.5" />
              ) : null}
              {current ? (
                <span
                  aria-current="page"
                  className="text-foreground capitalize"
                >
                  {part.replaceAll("-", " ")}
                </span>
              ) : (
                <Link className="hover:text-foreground capitalize" href={href}>
                  {part}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
