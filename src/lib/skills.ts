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
