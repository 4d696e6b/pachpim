"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { CmsImage } from "@/components/shared/cms-image";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  Input,
  Label,
  Textarea,
} from "@/components/ui/form-controls";
import { MediaUploader } from "@/features/media/media-uploader";
import { saveProject } from "@/features/projects/actions";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/features/projects/project-form-schema";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { slugify } from "@/lib/utils";

const defaults: ProjectFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  description: "",
  category: "",
  year: new Date().getFullYear(),
  status: "draft",
  featured: false,
  sortOrder: 0,
  technologies: "",
  statusLabel: "In progress",
  coverImageUrl: "",
  gallery: "",
  liveUrl: "",
  repositoryUrl: "",
  challenge: "",
  approach: "",
  process: "",
  outcome: "",
  metrics: "",
};

function ProjectField({
  name,
  label,
  hint,
  multiline = false,
  type,
}: {
  name: keyof ProjectFormValues;
  label: string;
  hint?: string;
  multiline?: boolean;
  type?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();
  const message = errors[name]?.message;
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      {multiline ? (
        <Textarea id={name} rows={4} {...register(name)} />
      ) : (
        <Input
          id={name}
          type={type}
          {...register(
            name,
            type === "number" ? { valueAsNumber: true } : undefined,
          )}
        />
      )}
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
      <FieldError>
        {typeof message === "string" ? message : undefined}
      </FieldError>
    </div>
  );
}

export function ProjectForm({
  id = null,
  initialValues,
}: {
  id?: string | null;
  initialValues?: ProjectFormValues;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const methods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialValues ?? defaults,
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = methods;
  useUnsavedChanges(isDirty && !saving);
  const title = useWatch({ control, name: "title" });
  const cover = useWatch({ control, name: "coverImageUrl" });

  async function submit(values: ProjectFormValues) {
    setSaving(true);
    const result = await saveProject(id, values);
    if (!result.ok) {
      toast.error(result.error);
      setSaving(false);
      return;
    }
    toast.success(id ? "Project updated." : "Project created.");
    router.replace(`/admin/projects/${result.id}`);
    router.refresh();
  }

  return (
    <FormProvider {...methods}>
      <form className="grid gap-8" onSubmit={handleSubmit(submit)}>
        <section className="bg-card grid gap-5 rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Basics</h2>
          <ProjectField label="Title" name="title" />
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
          <ProjectField label="Short excerpt" name="excerpt" multiline />
          <ProjectField label="Full description" name="description" multiline />
          <div className="grid gap-5 sm:grid-cols-2">
            <ProjectField label="Category" name="category" />
            <ProjectField label="Year" name="year" type="number" />
            <ProjectField label="Status label" name="statusLabel" />
            <ProjectField label="Sort order" name="sortOrder" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Publishing status</Label>
            <select
              className="bg-background h-11 rounded-xl border px-3 text-sm"
              id="status"
              {...register("status")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              className="size-4 accent-[var(--accent)]"
              type="checkbox"
              {...register("featured")}
            />
            Feature this project
          </label>
        </section>

        <section className="bg-card grid gap-5 rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Case study</h2>
          <ProjectField label="Challenge" name="challenge" multiline />
          <ProjectField label="Approach" name="approach" multiline />
          <ProjectField label="Process" name="process" multiline />
          <ProjectField label="Outcome" name="outcome" multiline />
          <ProjectField
            hint="One metric per line, formatted as Label: Value"
            label="Key metrics"
            name="metrics"
            multiline
          />
        </section>

        <section className="bg-card grid gap-5 rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Technology and media</h2>
          <MediaUploader />
          <p className="text-muted-foreground text-xs">
            Files are stored in Firestore (700 KB max). Publish them in Media,
            then paste the copied URL into the cover or gallery fields.
          </p>
          <ProjectField
            hint="Comma-separated"
            label="Technologies"
            name="technologies"
          />
          <ProjectField label="Cover image URL" name="coverImageUrl" />
          {cover ? (
            <div className="relative aspect-video overflow-hidden rounded-2xl border">
              <CmsImage
                alt="Cover preview"
                className="object-cover"
                fill
                sizes="700px"
                src={cover}
              />
            </div>
          ) : null}
          <ProjectField
            hint="One public image URL per line"
            label="Gallery URLs"
            name="gallery"
            multiline
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <ProjectField label="Live website URL" name="liveUrl" />
            <ProjectField label="Source repository URL" name="repositoryUrl" />
          </div>
        </section>

        <div className="bg-background/90 sticky bottom-4 flex justify-end rounded-2xl border p-3 shadow-xl backdrop-blur">
          <Button disabled={saving} type="submit" variant="accent">
            <Save className="size-4" />
            {saving ? "Saving…" : "Save project"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
