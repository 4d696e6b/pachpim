const categoryLabels: Record<string, string> = {
  "Language(Spoken)": "Spoken Languages",
  Fullstack: "Full-Stack Development",
  Architecture: "Architecture & Systems",
  Language: "Programming Languages",
  "Soft Skill": "Professional Skills",
  "Version Control": "Tools & Workflow",
  Database: "Data & Databases",
  Platform: "Platforms",
};

const categoryOrder = [
  "Full-Stack Development",
  "Programming Languages",
  "Data & Databases",
  "Architecture & Systems",
  "Tools & Workflow",
  "Platforms",
  "Professional Skills",
  "Spoken Languages",
];

export function displaySkillCategory(category: string) {
  return (categoryLabels[category] ?? category.trim()) || "Skills";
}

export function groupSkills(
  skills: Array<{ id: string; name: string; category: string }>,
) {
  const groups = new Map<
    string,
    Array<{ id: string; name: string; category: string }>
  >();

  for (const skill of skills) {
    const category = displaySkillCategory(skill.category);
    groups.set(category, [...(groups.get(category) ?? []), skill]);
  }

  return [...groups.entries()].sort(([a], [b]) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function SkillHolders({
  skills,
}: {
  skills: Array<{ id: string; name: string; category: string }>;
}) {
  return (
    <div className="mt-9 grid gap-x-8 gap-y-9 sm:grid-cols-2">
      {groupSkills(skills).map(([category, items]) => (
        <section key={category}>
          <div className="flex items-baseline justify-between gap-4 border-b pb-3">
            <h3 className="font-semibold tracking-tight">{category}</h3>
            <span className="text-muted-foreground text-xs">
              {items.length}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {items.map((skill) => (
              <span
                className="bg-muted text-foreground rounded-full px-3 py-1.5 text-sm"
                key={skill.id}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
