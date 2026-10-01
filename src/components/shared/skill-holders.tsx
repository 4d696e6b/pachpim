"use client";

import type { CSSProperties } from "react";

import { Stagger, StaggerItem } from "@/components/shared/motion";
import { groupSkills } from "@/lib/skills";

export function SkillHolders({
  skills,
}: {
  skills: Array<{ id: string; name: string; category: string }>;
}) {
  return (
    <Stagger className="mt-9 grid gap-x-8 gap-y-9 sm:grid-cols-2">
      {groupSkills(skills).map(([category, items]) => (
        <StaggerItem className="skill-group" key={category}>
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
        </StaggerItem>
      ))}
    </Stagger>
  );
}
