import { z } from "zod";

import { isSafeUrl } from "@/lib/security";

const optionalUrl = z.union([z.literal(""), z.url("Enter a valid URL.")]);
const optionalAssetUrl = z.union([
  z.literal(""),
  z
    .string()
    .trim()
    .refine(
      (value) => isSafeUrl(value, { allowRelative: true }),
      "Enter a valid URL or /api/media file path.",
    ),
]);

export const projectFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens.",
    ),
  excerpt: z.string().trim().min(20).max(240),
  description: z.string().trim().min(30).max(2000),
  category: z.string().trim().min(2).max(80),
  year: z.number().int().min(1990).max(2100),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
  technologies: z.string().max(600),
  statusLabel: z.string().trim().min(2).max(60),
  coverImageUrl: optionalAssetUrl,
  gallery: z.string().max(4000),
  liveUrl: optionalUrl,
  repositoryUrl: optionalUrl,
  challenge: z.string().trim().min(10).max(4000),
  approach: z.string().trim().min(10).max(4000),
  process: z.string().trim().min(10).max(4000),
  outcome: z.string().trim().min(10).max(4000),
  metrics: z.string().max(1000),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
