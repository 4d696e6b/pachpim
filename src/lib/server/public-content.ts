import "server-only";

import { unstable_cache } from "next/cache";
import { unstable_rethrow } from "next/navigation";

import { siteConfig } from "@/config/site";
import { isImageAssetUrl } from "@/lib/media";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export interface PublicProject {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  year: number;
  technologies: string[];
  featured: boolean;
  coverImageUrl?: string;
  gallery: string[];
  statusLabel: string;
  challenge: string;
  approach: string;
  process: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  repositoryUrl?: string;
  updatedAt: string;
}

export interface PublicNote {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  readingTime: number;
  coverImageUrl?: string;
  publishedAt: string;
}

export interface PublicProfile {
  name: string;
  professionalTitle: string;
  biography: string;
  shortIntroduction: string;
  location: string;
  email: string;
  profilePhotoUrl?: string;
  resumeUrl?: string;
  availability: string;
  socialLinks: { label: string; url: string }[];
  latestUpdate?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  type: "experience" | "education";
}

export interface PublicSkill {
  id: string;
  name: string;
  category: string;
}

export interface PublicAchievement {
  id: string;
  title: string;
  description: string;
}

export interface PublicCertification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
  imageUrl?: string;
}

export const sampleProjects: PublicProject[] = [
  {
    id: "sample-orbit",
    slug: "sample-orbit-workspace",
    title: "Orbit Workspace",
    excerpt:
      "Sample project — a calm command center for distributed product teams.",
    description:
      "A clearly labeled sample case study showing how complex planning workflows can become focused, legible, and collaborative.",
    category: "Product engineering",
    year: 2026,
    technologies: ["Next.js", "TypeScript", "Firebase"],
    featured: true,
    gallery: [],
    statusLabel: "Sample concept",
    challenge:
      "Distributed teams were losing decisions across tools and long message threads.",
    approach:
      "Unify planning, decisions, and lightweight progress signals in one deliberate workspace.",
    process:
      "Mapped the decision journey, prototyped the riskiest flows, and validated information density.",
    outcome:
      "A cohesive sample product direction ready for usability testing and technical discovery.",
    metrics: [
      { label: "Prototype flows", value: "12" },
      { label: "Accessibility target", value: "WCAG AA" },
    ],
    updatedAt: "2026-08-15T00:00:00.000Z",
  },
  {
    id: "sample-ledger",
    slug: "sample-ledger-insights",
    title: "Ledger Insights",
    excerpt:
      "Sample project — understandable financial reporting for independent teams.",
    description:
      "A sample analytics experience centered on clarity, context, and accountable decisions.",
    category: "Data product",
    year: 2025,
    technologies: ["React", "Node.js", "PostgreSQL"],
    featured: true,
    gallery: [],
    statusLabel: "Sample concept",
    challenge:
      "Dense reporting made it hard for non-specialists to identify meaningful changes.",
    approach:
      "Pair progressive disclosure with plain-language explanations and traceable calculations.",
    process:
      "Audited workflows, built a metric taxonomy, and tested chart comprehension at multiple densities.",
    outcome:
      "A sample dashboard system that makes high-level signals and source details equally accessible.",
    metrics: [{ label: "Reusable views", value: "18" }],
    updatedAt: "2025-11-10T00:00:00.000Z",
  },
  {
    id: "sample-field",
    slug: "sample-field-notes",
    title: "Field Notes",
    excerpt:
      "Sample project — an offline-first research journal for work beyond the desk.",
    description:
      "A clearly marked sample mobile workflow for capturing structured observations.",
    category: "Mobile experience",
    year: 2025,
    technologies: ["React Native", "TypeScript", "SQLite"],
    featured: false,
    gallery: [],
    statusLabel: "Sample prototype",
    challenge:
      "Researchers needed reliable capture in low-connectivity environments.",
    approach:
      "Design around local-first data, visible sync state, and fast repeat entry.",
    process:
      "Shadowed field workflows, reduced input steps, and prototyped conflict resolution.",
    outcome:
      "A resilient sample experience with a clear path to an operational pilot.",
    metrics: [{ label: "Offline capable", value: "100%" }],
    updatedAt: "2025-06-02T00:00:00.000Z",
  },
  {
    id: "sample-atlas",
    slug: "sample-atlas-design-system",
    title: "Atlas Design System",
    excerpt:
      "Sample project — a practical shared language for a growing product suite.",
    description:
      "A sample design-system program balancing consistency with product-team autonomy.",
    category: "Design systems",
    year: 2024,
    technologies: ["Storybook", "React", "Figma"],
    featured: false,
    gallery: [],
    statusLabel: "Sample case study",
    challenge:
      "Teams repeatedly solved the same interface problems with inconsistent results.",
    approach:
      "Create a token-led foundation, contribution model, and adoption path—not only a component kit.",
    process:
      "Inventoried patterns, prioritized foundations, and documented quality gates.",
    outcome:
      "A sample system architecture ready to scale across products and disciplines.",
    metrics: [{ label: "Core patterns", value: "24" }],
    updatedAt: "2024-09-20T00:00:00.000Z",
  },
];

export const sampleNotes: PublicNote[] = [
  {
    id: "sample-note-1",
    slug: "designing-for-confident-decisions",
    title: "Designing for confident decisions",
    excerpt:
      "Sample note — practical ways to make complex interfaces feel trustworthy.",
    category: "Product design",
    tags: ["Design", "Trust", "UX"],
    readingTime: 5,
    publishedAt: "2026-08-20T00:00:00.000Z",
    body: `## Clarity is a product feature

Trust starts when people can understand what happened, why it happened, and what they can do next.

## Show the system's work

Expose meaningful status, describe consequences before destructive actions, and keep recovery paths visible.

## Prefer calm confidence

Good interfaces do not ask for attention constantly. They reserve emphasis for the moments that matter.`,
  },
  {
    id: "sample-note-2",
    slug: "small-systems-that-scale",
    title: "Small systems that scale",
    excerpt:
      "Sample note — how restrained foundations create room for product teams to move.",
    category: "Engineering",
    tags: ["Architecture", "Teams"],
    readingTime: 4,
    publishedAt: "2026-07-04T00:00:00.000Z",
    body: `## Start with boundaries

A useful architecture makes ownership and change paths obvious before it adds abstraction.

## Optimize for replacement

Small modules with explicit inputs are easier to test, improve, and eventually replace.

## Document decisions

The reason behind a constraint is often more valuable than the constraint itself.`,
  },
];

export const emptyProfile: PublicProfile = {
  name: "",
  professionalTitle: "",
  biography: "",
  shortIntroduction: "",
  location: "",
  email: "",
  availability: "",
  socialLinks: [],
  latestUpdate: "",
};

export const sampleProfile: PublicProfile = {
  name: "Alex Morgan",
  professionalTitle: "Product-minded software engineer",
  shortIntroduction:
    "I turn ambiguous product problems into reliable, accessible digital experiences.",
  biography:
    "This sample profile represents a multidisciplinary technology professional who works across product strategy, interface design, and full-stack engineering. Replace every detail securely from the admin dashboard.",
  location: "Available worldwide",
  email: "hello@example.com",
  availability: "Open to thoughtful collaborations",
  socialLinks: [
    { label: "GitHub", url: "https://github.com/example" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/example" },
    { label: "X", url: "https://x.com/example" },
  ],
  latestUpdate: "",
};

export function siteIdentity(profile: PublicProfile) {
  const name = profile.name.trim() || siteConfig.name;
  const title = profile.professionalTitle.trim();
  const description =
    profile.shortIntroduction.trim() ||
    profile.biography.trim() ||
    `${name} — portfolio`;
  return { name, title, description };
}

function asSocialLinks(value: unknown): PublicProfile["socialLinks"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as { label?: unknown; url?: unknown };
    const label = String(record.label ?? "").trim();
    const url = String(record.url ?? "").trim();
    return label && url ? [{ label, url }] : [];
  });
}

function normalizeProfile(data: Record<string, unknown>): PublicProfile {
  return {
    name: String(data.name ?? "").trim(),
    professionalTitle: String(
      data.professionalTitle ?? data.headline ?? "",
    ).trim(),
    biography: String(data.biography ?? data.bio ?? "").trim(),
    shortIntroduction: String(
      data.shortIntroduction ?? data.shortBio ?? "",
    ).trim(),
    location: String(data.location ?? "").trim(),
    email: String(data.email ?? "").trim(),
    profilePhotoUrl: data.profilePhotoUrl
      ? String(data.profilePhotoUrl)
      : undefined,
    resumeUrl: data.resumeUrl ? String(data.resumeUrl) : undefined,
    availability: String(data.availability ?? "").trim(),
    socialLinks: asSocialLinks(data.socialLinks),
    latestUpdate: String(data.latestUpdate ?? "").trim() || undefined,
  };
}

export const sampleSkills = [
  { id: "skill-1", name: "TypeScript", category: "Engineering" },
  { id: "skill-2", name: "React & Next.js", category: "Engineering" },
  { id: "skill-3", name: "Firebase", category: "Platforms" },
  { id: "skill-4", name: "Product strategy", category: "Product" },
  { id: "skill-5", name: "Interaction design", category: "Design" },
  { id: "skill-6", name: "Design systems", category: "Design" },
];

export const sampleTimeline: TimelineItem[] = [
  {
    id: "timeline-1",
    title: "Lead product engineer",
    organization: "Sample independent practice",
    period: "2024 — Present",
    description:
      "Sample entry — leading product discovery, design, and implementation.",
    type: "experience",
  },
  {
    id: "timeline-2",
    title: "Senior software engineer",
    organization: "Sample technology studio",
    period: "2021 — 2024",
    description:
      "Sample entry — built accessible web products and reusable systems.",
    type: "experience",
  },
  {
    id: "timeline-3",
    title: "B.Sc. Computer Science",
    organization: "Sample University",
    period: "2017 — 2021",
    description:
      "Sample education entry — replace with your verified background.",
    type: "education",
  },
];

function asIso(value: unknown, fallback = new Date(0).toISOString()) {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return fallback;
}

async function loadPublicContent() {
  try {
    const db = getAdminFirestore();
    const [
      projectsSnapshot,
      notesSnapshot,
      profileSnapshot,
      skillsSnapshot,
      expSnapshot,
      eduSnapshot,
      achievementsSnapshot,
      certificationsSnapshot,
    ] = await Promise.all([
      db.collection("projects").where("status", "==", "published").get(),
      db.collection("notes").where("status", "==", "published").get(),
      db.collection("profile").doc("public").get(),
      db.collection("skills").where("status", "==", "published").get(),
      db.collection("experiences").where("status", "==", "published").get(),
      db.collection("education").where("status", "==", "published").get(),
      db.collection("achievements").where("status", "==", "published").get(),
      db.collection("certifications").where("status", "==", "published").get(),
    ]);

    const projects = projectsSnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            updatedAt: asIso(doc.get("updatedAt")),
          }) as PublicProject,
      )
      .sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year,
      );
    const notes = notesSnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            publishedAt: asIso(doc.get("publishedAt")),
          }) as PublicNote,
      )
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    const profile = profileSnapshot.exists
      ? normalizeProfile(profileSnapshot.data() ?? {})
      : emptyProfile;
    const skills = skillsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: String(doc.get("name")),
      category: String(doc.get("category")),
    }));
    const timeline = [...expSnapshot.docs, ...eduSnapshot.docs]
      .map((doc) => ({ id: doc.id, ...doc.data() }) as TimelineItem)
      .sort((a, b) => b.period.localeCompare(a.period));
    const achievements = achievementsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: String(doc.get("title")),
      description: String(doc.get("description")),
    }));
    const certifications = certificationsSnapshot.docs.map((doc) => {
      const url = doc.get("url") ? String(doc.get("url")) : undefined;
      const storedImage = doc.get("imageUrl")
        ? String(doc.get("imageUrl"))
        : undefined;
      return {
        id: doc.id,
        title: String(doc.get("title")),
        issuer: String(doc.get("issuer")),
        date: String(doc.get("date")),
        url,
        imageUrl:
          storedImage || (url && isImageAssetUrl(url) ? url : undefined),
      };
    });

    return {
      projects,
      notes,
      profile,
      skills,
      timeline,
      achievements,
      certifications,
    };
  } catch (error) {
    unstable_rethrow(error);
    if (
      process.env.NODE_ENV === "production" &&
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    )
      console.error("Public content fallback used", error);
    return {
      projects: [] as PublicProject[],
      notes: [] as PublicNote[],
      profile: emptyProfile,
      skills: [] as PublicSkill[],
      timeline: [] as TimelineItem[],
      achievements: [] as PublicAchievement[],
      certifications: [] as PublicCertification[],
    };
  }
}

export const getPublicContent = unstable_cache(
  loadPublicContent,
  ["public-content"],
  {
    revalidate: 300,
    tags: ["public-content"],
  },
);
