import { z } from "zod";

import { isSafeUrl } from "@/lib/security";

export const noteFormSchema = z.object({
  title: z.string().trim().min(2).max(140),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(20).max(280),
  body: z.string().trim().min(30).max(100000),
  category: z.string().trim().min(2).max(80),
  tags: z.string().max(500),
  status: z.enum(["draft", "published"]),
  coverImageUrl: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .refine(
        (value) => isSafeUrl(value, { allowRelative: true }),
        "Enter a valid URL or /api/media file path.",
      ),
  ]),
  publishedAt: z.string(),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
