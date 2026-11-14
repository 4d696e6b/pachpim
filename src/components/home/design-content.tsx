import type { CSSProperties } from "react";

import { groupSkills } from "@/lib/skills";
import { cn } from "@/lib/utils";

import { DesignReveal } from "./design-reveal";

export function DesignSectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <DesignReveal className={cn("max-w-2xl", className)} label={eyebrow}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-5 text-base leading-7 sm:text-lg">
          {description}
        </p>
      ) : null}
    </DesignReveal>
  );
}

export function DesignSkills({
  skills,
}: {
  skills: Array<{ id: string; name: string; category: string }>;
}) {
  return (
    <div className="mt-9 grid gap-x-8 gap-y-9 sm:grid-cols-2">
      {groupSkills(skills).map(([category, items]) => (
        <DesignReveal className="skill-group" key={category} label={category}>
          <section>
            <div className="flex items-baseline justify-between gap-4 border-b pb-3">
              <h3 className="font-semibold tracking-tight">{category}</h3>
              <span className="text-muted-foreground text-xs">
                {items.length}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {items.map((skill, index) => (
                <span
                  className="skill-chip bg-muted text-foreground rounded-full px-3 py-1.5 text-sm"
                  key={skill.id}
                  style={{ "--skill-index": index } as CSSProperties}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </DesignReveal>
      ))}
    </div>
  );
}
