"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Save, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { EditorWorkspace } from "@/components/admin/editor-workspace";
import { NotePreview } from "@/components/admin/content-preview";
import { CmsImage } from "@/components/shared/cms-image";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  Input,
  Label,
  Textarea,
} from "@/components/ui/form-controls";
import { MediaUploader } from "@/features/media/media-uploader";
import { saveNote } from "@/features/notes/actions";
import { MarkdownContent } from "@/features/notes/markdown-content";
import {
  noteFormSchema,
  type NoteFormValues,
} from "@/features/notes/note-form-schema";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { mediaFileUrl } from "@/lib/media";
import { slugify } from "@/lib/utils";

const defaults: NoteFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  body: "## Start writing\n\nShare a useful idea.",
  category: "",
  tags: "",
  status: "draft",
  coverImageUrl: "",
  publishedAt: new Date().toISOString().slice(0, 10),
};

export function NoteForm({
  id = null,
  initialValues,
}: {
  id?: string | null;
  initialValues?: NoteFormValues;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: initialValues ?? defaults,
  });
  useUnsavedChanges(isDirty && !saving);
  const values = useWatch({ control });
  const title = useWatch({ control, name: "title" });
  const body = useWatch({ control, name: "body" });
  const cover = useWatch({ control, name: "coverImageUrl" });
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: bodyRegisterRef, ...bodyField } = register("body");

  function insertIntoBody(snippet: string) {
    const field = bodyRef.current;
    if (!field) {
      setValue("body", `${body}${snippet}`, { shouldDirty: true });
      return;
    }
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const next = `${body.slice(0, start)}${snippet}${body.slice(end)}`;
    setValue("body", next, { shouldDirty: true, shouldValidate: true });
    requestAnimationFrame(() => {
      const cursor = start + snippet.length;
      field.focus();
      field.setSelectionRange(cursor, cursor);
    });
  }

  async function addPhotoToNote(id?: string) {
    if (!id) return;
    const url = mediaFileUrl(id);
    const response = await fetch(`/api/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: "public" }),
    }).catch(() => null);
    if (!response?.ok) {
      toast.error(
        "Photo uploaded but could not be made public. Check Media before inserting it.",
      );
      return;
    }
    insertIntoBody(`\n\n![Photo](${url})\n\n`);
    if (!cover?.trim()) {
      setValue("coverImageUrl", url, { shouldDirty: true });
    }
    toast.success("Photo inserted. Publish the note when you are ready.");
  }

  async function submit(values: NoteFormValues) {
    setSaving(true);
    let result;
    try {
      result = await saveNote(id, values);
    } catch {
      toast.error("Could not save. Please try again.");
      setSaving(false);
      return;
    }
    if (!result.ok) {
      toast.error(result.error);
      setSaving(false);
      return;
    }
    reset(values);
    setSaving(false);
    toast.success(id ? "Note updated." : "Note created.");
    router.replace(`/admin/notes/${result.id}`);
    router.refresh();
  }

  return (
    <form
      className="grid gap-8"
      onSubmit={handleSubmit(submit, () =>
        toast.error("Check the highlighted fields in Edit view."),
      )}
    >
      <fieldset disabled={saving} className="min-w-0">
        <EditorWorkspace
          kind="Note"
          dirty={isDirty}
          preview={<NotePreview values={values} />}
        >
          <section className="bg-card grid gap-5 rounded-3xl border p-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              <FieldError>{errors.title?.message}</FieldError>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input id="slug" {...register("slug")} />
                <Button
                  aria-label="Generate slug from title"
                  onClick={() =>
                    setValue("slug", slugify(title), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <WandSparkles className="size-4" />
                </Button>
              </div>
              <FieldError>{errors.slug?.message}</FieldError>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" rows={3} {...register("excerpt")} />
              <FieldError>{errors.excerpt?.message}</FieldError>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register("category")} />
                <FieldError>{errors.category?.message}</FieldError>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Design, Engineering"
                  {...register("tags")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  className="bg-background h-11 rounded-xl border px-3 text-sm"
                  id="status"
                  {...register("status")}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="publishedAt">Publication date</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  {...register("publishedAt")}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coverImageUrl">Cover image URL</Label>
              <Input id="coverImageUrl" {...register("coverImageUrl")} />
              <FieldError>{errors.coverImageUrl?.message}</FieldError>
              {cover?.trim() ? (
                <div className="relative mt-1 aspect-video overflow-hidden rounded-2xl border">
                  <CmsImage
                    alt="Cover preview"
                    className="object-cover"
                    fill
                    sizes="700px"
                    src={cover}
                  />
                </div>
              ) : null}
            </div>
            <MediaUploader onUploaded={addPhotoToNote} />
            <p className="text-muted-foreground text-xs">
              Upload an image (up to 700 KB) to insert it into your note.
              Uploaded images are public; your note stays a draft until you
              publish it.
            </p>
          </section>

          <section className="bg-card rounded-3xl border p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Markdown content</h2>
              <Button
                onClick={() => setPreview((value) => !value)}
                size="sm"
                type="button"
                variant="outline"
              >
                <Eye className="size-4" /> {preview ? "Edit" : "Preview"}
              </Button>
            </div>
            <div
              className="mb-4 flex flex-wrap gap-2"
              aria-label="Insert content"
            >
              {[
                ["Heading", "\n\n## New section\n\n"],
                ["Bold", "**Bold text**"],
                ["List", "\n- First item\n- Second item\n"],
                ["Link", "[Link text](https://example.com)"],
                ["Code", "\n\n```typescript\n// Your code here\n```\n"],
                ["Quote", "\n\n> A useful takeaway.\n"],
                ["Divider", "\n\n---\n\n"],
              ].map(([label, snippet]) => (
                <Button
                  key={label}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPreview(false);
                    insertIntoBody(snippet);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground mb-4 text-xs">
              {body.trim().split(/\s+/).filter(Boolean).length} words ·{" "}
              {Math.max(
                1,
                Math.ceil(
                  body.trim().split(/\s+/).filter(Boolean).length / 220,
                ),
              )}{" "}
              min read. Use the toolbar to add structure, then refine it in the
              live preview.
            </p>
            {preview ? (
              <div className="bg-background min-h-96 rounded-2xl border p-6">
                <MarkdownContent body={body} />
              </div>
            ) : (
              <>
                <Textarea
                  className="min-h-[32rem] font-mono text-sm leading-6"
                  id="body"
                  {...bodyField}
                  ref={(element) => {
                    bodyRegisterRef(element);
                    bodyRef.current = element;
                  }}
                />
                <FieldError>{errors.body?.message}</FieldError>
              </>
            )}
          </section>
        </EditorWorkspace>
      </fieldset>
      <div className="bg-background/90 sticky bottom-4 flex justify-end rounded-2xl border p-3 shadow-xl backdrop-blur">
        <Button disabled={saving} type="submit" variant="accent">
          <Save className="size-4" /> {saving ? "Saving…" : "Save note"}
        </Button>
      </div>
    </form>
  );
}
