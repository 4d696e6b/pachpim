"use client";

import { CmsImage } from "@/components/shared/cms-image";
import { MarkdownContent } from "@/features/notes/markdown-content";
import type { ProjectFormValues } from "@/features/projects/project-form-schema";
import type { NoteFormValues } from "@/features/notes/note-form-schema";
import { isSafeUrl } from "@/lib/security";

function PreviewCover({ src }: { src?: string }) {
  return src && isSafeUrl(src, { allowRelative: true }) ? (
    <div className="bg-muted relative my-6 aspect-video overflow-hidden rounded-xl">
      <CmsImage
        src={src}
        alt="Content cover preview"
        fill
        unoptimized
        className="object-cover"
        sizes="600px"
      />
    </div>
  ) : (
    <div className="preview-cover my-6 grid aspect-video place-items-center rounded-xl border">
      <p className="text-muted-foreground text-sm">
        Your cover image goes here
      </p>
    </div>
  );
}
export function ProjectPreview({
  values,
}: {
  values: Partial<ProjectFormValues>;
}) {
  return (
    <article className="break-words">
      <p className="eyebrow">
        {values.category || "Project category"} · {values.year}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">
        {values.title || "Your next great project"}
      </h2>
      <p className="text-muted-foreground mt-4 leading-7">
        {values.excerpt ||
          "A short introduction to what you built and why it matters."}
      </p>
      <PreviewCover src={values.coverImageUrl} />
      <div className="mb-8 flex flex-wrap gap-2">
        {values.technologies
          ?.split(",")
          .filter((x) => x.trim())
          .map((x, i) => (
            <span key={i} className="bg-muted rounded-full px-3 py-1 text-xs">
              {x.trim()}
            </span>
          ))}
      </div>
      {(
        [
          ["Overview", "description"],
          ["Challenge", "challenge"],
          ["Approach", "approach"],
          ["Process", "process"],
          ["Outcome", "outcome"],
        ] as const
      ).map(([label, key]) => (
        <section key={key} className="mb-7">
          <h3 className="font-semibold">{label}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-7 whitespace-pre-wrap">
            {values[key] ||
              `Tell the story behind this ${label.toLowerCase()}.`}
          </p>
        </section>
      ))}
      <div className="grid gap-2">
        {values.metrics
          ?.split("\n")
          .filter(Boolean)
          .map((metric, i) => (
            <p key={i} className="bg-muted rounded-xl p-4 text-sm">
              {metric}
            </p>
          ))}
      </div>
    </article>
  );
}
export function NotePreview({ values }: { values: Partial<NoteFormValues> }) {
  return (
    <article className="break-words">
      <p className="eyebrow">{values.category || "Notebook"}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">
        {values.title || "An idea worth sharing"}
      </h2>
      <p className="text-muted-foreground mt-4 leading-7">
        {values.excerpt || "Introduce the idea your reader will take away."}
      </p>
      <PreviewCover src={values.coverImageUrl} />
      <MarkdownContent
        body={values.body || "Start writing to see your note here."}
      />
    </article>
  );
}
