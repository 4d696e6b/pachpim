import { calculateReadingTime } from "@/lib/security";
import type {
  ExperienceInput,
  NoteInput,
  ProfileInput,
  ProjectInput,
  SiteSettingsInput,
  SkillInput,
} from "@/types";

/**
 * SAMPLE CONTENT ONLY
 * Replace every name, URL, biography, and project description before launch.
 */

export interface IdentifiedSample<T> {
  id: string;
  data: T;
}

export const SAMPLE_PROFILE: ProfileInput = {
  name: "Alex Morgan",
  headline: "Product-minded software engineer",
  shortBio: "I build reliable, accessible web products for growing teams.",
  bio: "I am a sample portfolio owner focused on thoughtful product engineering, dependable systems, and clear collaboration. Replace this biography with your own story.",
  location: "Bangkok, Thailand",
  email: "hello@example.com",
  avatarMediaId: null,
  resumeUrl: "https://example.com/resume.pdf",
  availability: "available",
  socialLinks: [
    { label: "GitHub", url: "https://github.com/example", icon: "github" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/example",
      icon: "linkedin",
    },
  ],
};

export const SAMPLE_PROJECTS: ReadonlyArray<IdentifiedSample<ProjectInput>> = [
  {
    id: "sample-commerce-platform",
    data: {
      slug: "commerce-platform",
      title: "Commerce Platform",
      summary:
        "A resilient storefront and operations system for a growing retailer.",
      description:
        "Sample case study describing a typed checkout, inventory workflows, observability, and a measured migration strategy.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
      links: [
        {
          label: "Case study",
          url: "https://example.com/work/commerce",
          kind: "case-study",
        },
      ],
      coverMediaId: null,
      galleryMediaIds: [],
      featured: true,
      status: "published",
      order: 1,
      publishedAt: new Date("2026-01-15T00:00:00.000Z"),
    },
  },
  {
    id: "sample-design-system",
    data: {
      slug: "design-system",
      title: "Design System",
      summary: "An accessible component library shared across product teams.",
      description:
        "Sample case study covering design tokens, documented interaction patterns, visual regression testing, and incremental adoption.",
      technologies: ["React", "TypeScript", "Storybook", "Playwright"],
      links: [
        {
          label: "Live preview",
          url: "https://example.com/work/design-system",
          kind: "live",
        },
      ],
      coverMediaId: null,
      galleryMediaIds: [],
      featured: true,
      status: "published",
      order: 2,
      publishedAt: new Date("2025-10-04T00:00:00.000Z"),
    },
  },
  {
    id: "sample-insights-dashboard",
    data: {
      slug: "insights-dashboard",
      title: "Insights Dashboard",
      summary: "A fast analytics workspace for customer success teams.",
      description:
        "Sample case study about turning fragmented event data into useful, permission-aware dashboards with predictable performance.",
      technologies: ["Next.js", "BigQuery", "Firebase", "D3"],
      links: [
        {
          label: "Case study",
          url: "https://example.com/work/insights",
          kind: "case-study",
        },
      ],
      coverMediaId: null,
      galleryMediaIds: [],
      featured: false,
      status: "published",
      order: 3,
      publishedAt: new Date("2025-06-19T00:00:00.000Z"),
    },
  },
  {
    id: "sample-field-notes",
    data: {
      slug: "field-notes-app",
      title: "Field Notes App",
      summary:
        "An offline-first capture tool for researchers working on location.",
      description:
        "Sample case study describing local-first data capture, conflict resolution, media uploads, and accessible mobile interactions.",
      technologies: ["React", "IndexedDB", "Firebase", "PWA"],
      links: [
        {
          label: "Source",
          url: "https://github.com/example/field-notes",
          kind: "source",
        },
      ],
      coverMediaId: null,
      galleryMediaIds: [],
      featured: false,
      status: "published",
      order: 4,
      publishedAt: new Date("2025-02-08T00:00:00.000Z"),
    },
  },
];

export const SAMPLE_SKILLS: ReadonlyArray<IdentifiedSample<SkillInput>> = [
  ["typescript", "TypeScript", "Engineering", 5, 7],
  ["nextjs", "Next.js", "Engineering", 5, 5],
  ["react", "React", "Engineering", 5, 7],
  ["firebase", "Firebase", "Platform", 4, 4],
  ["nodejs", "Node.js", "Platform", 4, 7],
  ["product-design", "Product Design", "Product", 3, 4],
].map(([id, name, category, proficiency, yearsOfExperience], order) => ({
  id: id as string,
  data: {
    name: name as string,
    category: category as string,
    proficiency: proficiency as SkillInput["proficiency"],
    yearsOfExperience: yearsOfExperience as number,
    icon: null,
    featured: order < 4,
    order: order + 1,
  },
}));

export const SAMPLE_TIMELINE_ENTRIES: ReadonlyArray<
  IdentifiedSample<ExperienceInput>
> = [
  {
    id: "sample-staff-engineer",
    data: {
      company: "Northstar Labs",
      role: "Staff Software Engineer",
      location: "Remote",
      startDate: "2023-04-01",
      endDate: null,
      current: true,
      summary:
        "Sample role leading product architecture and mentoring engineers.",
      highlights: [
        "Improved release reliability",
        "Established accessibility standards",
      ],
      technologies: ["TypeScript", "Next.js", "Google Cloud"],
      order: 1,
    },
  },
  {
    id: "sample-senior-engineer",
    data: {
      company: "Harbor Works",
      role: "Senior Software Engineer",
      location: "Singapore",
      startDate: "2020-01-01",
      endDate: "2023-03-31",
      current: false,
      summary:
        "Sample role building customer-facing workflows and internal platforms.",
      highlights: ["Led a frontend migration", "Reduced key page latency"],
      technologies: ["React", "Node.js", "PostgreSQL"],
      order: 2,
    },
  },
  {
    id: "sample-software-engineer",
    data: {
      company: "Studio Example",
      role: "Software Engineer",
      location: "Bangkok, Thailand",
      startDate: "2017-06-01",
      endDate: "2019-12-31",
      current: false,
      summary:
        "Sample role delivering websites and product prototypes for clients.",
      highlights: [
        "Shipped multi-language experiences",
        "Introduced automated testing",
      ],
      technologies: ["JavaScript", "React", "Ruby"],
      order: 3,
    },
  },
];

const firstNoteContent = `# Designing for failure

Reliable interfaces make partial failure visible and recoverable. Start by naming the failure modes, preserve user input, and offer the smallest useful next action.

This is sample note content. Replace it before publishing your portfolio.`;

const secondNoteContent = `# Small decisions in large TypeScript projects

Strict boundaries, explicit data transfer objects, and boring naming conventions reduce the amount of context a team must keep in working memory.

This is sample note content. Replace it with your own writing.`;

export const SAMPLE_NOTES: ReadonlyArray<IdentifiedSample<NoteInput>> = [
  {
    id: "sample-designing-for-failure",
    data: {
      slug: "designing-for-failure",
      title: "Designing for failure",
      excerpt:
        "Practical ways to make failure states understandable and recoverable.",
      content: firstNoteContent,
      tags: ["reliability", "product-engineering"],
      coverMediaId: null,
      status: "published",
      readingTimeMinutes: calculateReadingTime(firstNoteContent).minutes,
      publishedAt: new Date("2026-02-12T00:00:00.000Z"),
    },
  },
  {
    id: "sample-typescript-decisions",
    data: {
      slug: "small-decisions-in-typescript",
      title: "Small decisions in large TypeScript projects",
      excerpt:
        "How explicit boundaries and conventions keep a codebase understandable.",
      content: secondNoteContent,
      tags: ["typescript", "architecture"],
      coverMediaId: null,
      status: "published",
      readingTimeMinutes: calculateReadingTime(secondNoteContent).minutes,
      publishedAt: new Date("2025-11-07T00:00:00.000Z"),
    },
  },
];

export const SAMPLE_SITE_SETTINGS: SiteSettingsInput = {
  siteName: "Alex Morgan — Portfolio",
  siteUrl: "https://example.com",
  locale: "en",
  navigation: [
    { label: "Work", href: "/work", order: 1 },
    { label: "Notes", href: "/notes", order: 2 },
    { label: "About", href: "/about", order: 3 },
  ],
  seo: {
    title: "Alex Morgan — Software Engineer",
    description:
      "Sample portfolio content. Replace this description before launch.",
    keywords: ["software engineer", "portfolio", "web development"],
    socialImageMediaId: null,
  },
  contactEmail: "hello@example.com",
  maintenanceMode: false,
};
