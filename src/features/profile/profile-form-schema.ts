import { z } from "zod";

import { isSafeUrl } from "@/lib/security";

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

export const profileFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  professionalTitle: z.string().trim().min(2).max(160),
  shortIntroduction: z.string().trim().min(20).max(400),
  biography: z.string().trim().min(40).max(5000),
  location: z.string().trim().min(2).max(120),
  email: z.email(),
  profilePhotoUrl: optionalAssetUrl,
  resumeUrl: optionalAssetUrl,
  availability: z.string().trim().min(2).max(160),
  latestUpdate: z.string().trim().max(80),
  socialLinks: z.string().max(2000),
  skills: z.string().max(4000),
  experiences: z.string().max(10000),
  education: z.string().max(10000),
  certifications: z.string().max(6000),
  achievements: z.string().max(6000),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
