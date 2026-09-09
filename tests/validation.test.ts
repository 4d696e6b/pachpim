import { describe, expect, it } from "vitest";

import { noteFormSchema } from "@/features/notes/note-form-schema";
import { projectFormSchema } from "@/features/projects/project-form-schema";
import { isSafeUrl } from "@/lib/security";

describe("safe URLs", () => {
  it("allows normal HTTPS links", () => {
    expect(isSafeUrl("https://example.com/work")).toBe(true);
  });

  it("rejects executable protocols", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("data:text/html,unsafe")).toBe(false);
  });
});

describe("content validation", () => {
  it("rejects invalid project slugs", () => {
    const result = projectFormSchema.safeParse({
      title: "A project",
      slug: "Not A Slug",
      excerpt: "A sufficiently detailed project excerpt.",
      description:
        "A sufficiently detailed project description for validation.",
      category: "Engineering",
      year: 2026,
      status: "draft",
      featured: false,
      sortOrder: 0,
      technologies: "TypeScript",
      statusLabel: "In progress",
      coverImageUrl: "",
      gallery: "",
      liveUrl: "",
      repositoryUrl: "",
      challenge: "A meaningful challenge",
      approach: "A thoughtful approach",
      process: "A careful process",
      outcome: "A useful outcome",
      metrics: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires meaningful note content", () => {
    expect(
      noteFormSchema.safeParse({
        title: "Short note",
        slug: "short-note",
        excerpt: "A detailed enough sample note excerpt.",
        body: "Too short",
        category: "Engineering",
        tags: "",
        status: "draft",
        coverImageUrl: "",
        publishedAt: "2026-08-01",
      }).success,
    ).toBe(false);
  });
});
