import { z } from "zod";

import { isSafeUrl } from "@/lib/security";

const trimmedText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum);

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens.",
  );

export const safeUrlSchema = z
  .string()
  .trim()
  .max(2_048)
  .refine((value) => isSafeUrl(value), "Enter a safe HTTP(S) URL.");

export const relativeOrSafeUrlSchema = z
  .string()
  .trim()
  .max(2_048)
  .refine(
    (value) => isSafeUrl(value, { allowRelative: true }),
    "Enter a safe HTTP(S) or site-relative URL.",
  );

export const contactFormSchema = z.object({
  name: trimmedText(2, 100),
  email: z.string().trim().email().max(254),
  subject: trimmedText(2, 160),
  message: trimmedText(10, 5_000),
  website: z.string().max(0).optional(), // Honeypot.
});

const projectLinkSchema = z.object({
  label: trimmedText(1, 40),
  url: safeUrlSchema,
  kind: z.enum(["live", "source", "case-study", "other"]),
});

export const projectFormSchema = z.object({
  slug: slugSchema,
  title: trimmedText(2, 120),
  summary: trimmedText(10, 300),
  description: trimmedText(20, 50_000),
  technologies: z.array(trimmedText(1, 50)).max(30),
  links: z.array(projectLinkSchema).max(10),
  coverMediaId: z.string().trim().min(1).nullable(),
  galleryMediaIds: z.array(z.string().trim().min(1)).max(30),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
  order: z.number().int().min(0).max(10_000),
  publishedAt: z.coerce.date().nullable(),
});

export const noteFormSchema = z.object({
  slug: slugSchema,
  title: trimmedText(2, 160),
  excerpt: trimmedText(10, 400),
  content: trimmedText(20, 100_000),
  tags: z.array(trimmedText(1, 40)).max(20),
  coverMediaId: z.string().trim().min(1).nullable(),
  status: z.enum(["draft", "published", "archived"]),
  readingTimeMinutes: z.number().int().min(0).max(10_000),
  publishedAt: z.coerce.date().nullable(),
});

const socialLinkSchema = z.object({
  label: trimmedText(1, 40),
  url: safeUrlSchema,
  icon: z.string().trim().max(50).optional(),
});

export const profileFormSchema = z.object({
  name: trimmedText(2, 100),
  headline: trimmedText(2, 160),
  shortBio: trimmedText(10, 300),
  bio: trimmedText(20, 20_000),
  location: trimmedText(2, 120),
  email: z.string().trim().email().max(254),
  avatarMediaId: z.string().trim().min(1).nullable(),
  resumeUrl: safeUrlSchema.nullable(),
  availability: z.enum(["available", "limited", "unavailable"]),
  socialLinks: z.array(socialLinkSchema).max(12),
});

export const skillFormSchema = z.object({
  name: trimmedText(1, 80),
  category: trimmedText(1, 80),
  proficiency: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  yearsOfExperience: z.number().min(0).max(80),
  icon: z.string().trim().max(80).nullable(),
  featured: z.boolean(),
  order: z.number().int().min(0).max(10_000),
});

export const timelineFormSchema = z
  .object({
    company: trimmedText(1, 120),
    role: trimmedText(1, 120),
    location: trimmedText(1, 120),
    startDate: z.string().date(),
    endDate: z.string().date().nullable(),
    current: z.boolean(),
    summary: trimmedText(10, 2_000),
    highlights: z.array(trimmedText(1, 300)).max(20),
    technologies: z.array(trimmedText(1, 50)).max(30),
    order: z.number().int().min(0).max(10_000),
  })
  .refine((value) => (value.current ? value.endDate === null : true), {
    message: "Current roles cannot have an end date.",
    path: ["endDate"],
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type NoteFormValues = z.infer<typeof noteFormSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type SkillFormValues = z.infer<typeof skillFormSchema>;
export type TimelineFormValues = z.infer<typeof timelineFormSchema>;
