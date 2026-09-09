"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export function SkillHolders({
  skills,
}: {
  skills: Array<{ id: string; name: string; category: string }>;
}) {
  const reduceMotion = useReducedMotion();
  const grouped = useMemo(() => {
    const groups = new Map<
      string,
      Array<{ id: string; name: string; category: string }>
    >();
    for (const skill of skills) {
      const category = skill.category.trim() || "Skills";
      const list = groups.get(category) ?? [];
      list.push(skill);
      groups.set(category, list);
    }
    return [...groups.entries()];
  }, [skills]);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(grouped[0] ? [grouped[0][0]] : []),
  );

  function toggle(category: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <div className="mt-9 grid gap-3">
      {grouped.map(([category, items], index) => {
        const expanded = open.has(category);
        return (
          <div
            className={cn("skill-neon-holder", expanded && "is-open")}
            key={category}
            style={{ animationDelay: `${index * 0.35}s` }}
          >
            <button
              aria-expanded={expanded}
              className="btn-neon bg-card flex w-full items-center justify-between gap-3 rounded-[1.2rem] px-4 py-3.5 text-left"
              onClick={() => toggle(category)}
              type="button"
            >
              <span>
                <span className="block text-sm font-semibold tracking-tight">
                  {category}
                </span>
                <span className="text-muted-foreground mt-0.5 block text-xs">
                  {items.length} {items.length === 1 ? "skill" : "skills"}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "text-accent size-4 shrink-0 transition-transform duration-300",
                  expanded && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.32,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="flex flex-wrap gap-2 px-4 pt-1 pb-4">
                    {items.map((skill, skillIndex) => (
                      <span
                        className="skill-neon-chip"
                        key={skill.id}
                        style={{ animationDelay: `${skillIndex * 0.18}s` }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
