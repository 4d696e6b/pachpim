"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Save, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

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
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: initialValues ?? defaults,
  });
  useUnsavedChanges(isDirty && !saving);
  const title = useWatch({ control, name: "title" });
  const body = useWatch({ control, name: "body" });

  async function submit(values: NoteFormValues) {
    setSaving(true);
    const result = await saveNote(id, values);
    if (!result.ok) {
      toast.error(result.error);
      setSaving(false);
      return;
    }
    toast.success(id ? "Note updated." : "Note created.");
    router.replace(`/admin/notes/${result.id}`);
    router.refresh();
  }

  return (
    <form className="grid gap-8" onSubmit={handleSubmit(submit)}>
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
            <Input id="publishedAt" type="date" {...register("publishedAt")} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="coverImageUrl">Cover image URL</Label>
          <Input id="coverImageUrl" {...register("coverImageUrl")} />
          <FieldError>{errors.coverImageUrl?.message}</FieldError>
        </div>
        <MediaUploader />
        <p className="text-muted-foreground text-xs">
          Files are stored in Firestore (700 KB max). Publish in Media, then
          paste the copied URL here.
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
        {preview ? (
          <div className="bg-background min-h-96 rounded-2xl border p-6">
            <MarkdownContent body={body} />
          </div>
        ) : (
          <>
            <Textarea
              className="min-h-[32rem] font-mono text-sm leading-6"
              id="body"
              {...register("body")}
            />
            <FieldError>{errors.body?.message}</FieldError>
          </>
        )}
      </section>

      <div className="bg-background/90 sticky bottom-4 flex justify-end rounded-2xl border p-3 shadow-xl backdrop-blur">
        <Button disabled={saving} type="submit" variant="accent">
          <Save className="size-4" /> {saving ? "Saving…" : "Save note"}
        </Button>
      </div>
    </form>
  );
}
