"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FieldError,
  Input,
  Label,
  Textarea,
} from "@/components/ui/form-controls";
import { MediaUploader } from "@/features/media/media-uploader";
import { saveProfile } from "@/features/profile/actions";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/features/profile/profile-form-schema";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function ProfileForm({
  initialValues,
}: {
  initialValues: ProfileFormValues;
}) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues,
  });
  useUnsavedChanges(isDirty && !saving);

  async function submit(values: ProfileFormValues) {
    setSaving(true);
    const result = await saveProfile(values);
    if (!result.ok) {
      toast.error(result.error);
      setSaving(false);
      return;
    }
    toast.success("Profile and credentials updated.");
    setSaving(false);
  }

  const longFields: {
    name: keyof Pick<
      ProfileFormValues,
      | "socialLinks"
      | "skills"
      | "experiences"
      | "education"
      | "certifications"
      | "achievements"
    >;
    label: string;
    hint: string;
  }[] = [
    {
      name: "socialLinks",
      label: "Social links",
      hint: "One per line: Label | https://example.com",
    },
    { name: "skills", label: "Skills", hint: "One per line: Category | Skill" },
    {
      name: "experiences",
      label: "Work experience",
      hint: "One per line: Period | Role | Organization | Description",
    },
    {
      name: "education",
      label: "Education",
      hint: "One per line: Period | Qualification | Institution | Description",
    },
    {
      name: "certifications",
      label: "Certifications",
      hint: "One per line: Date | Certification | Issuer | Optional URL or image | Optional image URL",
    },
    {
      name: "achievements",
      label: "Achievements",
      hint: "One per line: Title | Verified description",
    },
  ];

  return (
    <form className="grid gap-8" onSubmit={handleSubmit(submit)}>
      <section className="bg-card grid gap-5 rounded-3xl border p-6">
        <h2 className="text-lg font-semibold">Public identity</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="professionalTitle">Professional title</Label>
            <Input id="professionalTitle" {...register("professionalTitle")} />
            <FieldError>{errors.professionalTitle?.message}</FieldError>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Public email</Label>
            <Input id="email" type="email" {...register("email")} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profilePhotoUrl">Profile photo URL</Label>
            <Input id="profilePhotoUrl" {...register("profilePhotoUrl")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resumeUrl">Résumé URL</Label>
            <Input id="resumeUrl" {...register("resumeUrl")} />
          </div>
        </div>
        <MediaUploader />
        <p className="text-muted-foreground text-xs">
          Files are stored in Firestore (700 KB max). Publish in Media, then
          paste the copied URL into the photo or résumé fields.
        </p>
        <div className="grid gap-2">
          <Label htmlFor="availability">Availability</Label>
          <Input id="availability" {...register("availability")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="latestUpdate">Latest update / version</Label>
          <Input
            id="latestUpdate"
            placeholder="v1.2 · 9 Sep 2026"
            {...register("latestUpdate")}
          />
          <p className="text-muted-foreground text-xs">
            Shown in the public footer. Enter a version, a date, or both. This
            is not updated automatically when you save.
          </p>
          <FieldError>{errors.latestUpdate?.message}</FieldError>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="shortIntroduction">Short introduction</Label>
          <Textarea
            id="shortIntroduction"
            rows={3}
            {...register("shortIntroduction")}
          />
          <FieldError>{errors.shortIntroduction?.message}</FieldError>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="biography">Biography</Label>
          <Textarea id="biography" rows={7} {...register("biography")} />
          <FieldError>{errors.biography?.message}</FieldError>
        </div>
      </section>

      <section className="bg-card grid gap-7 rounded-3xl border p-6">
        <div>
          <h2 className="text-lg font-semibold">Structured background</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Lines are converted into typed Firestore documents when saved.
          </p>
        </div>
        {longFields.map((field) => (
          <div className="grid gap-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea
              className="font-mono text-sm"
              id={field.name}
              rows={5}
              {...register(field.name)}
            />
            <p className="text-muted-foreground text-xs">{field.hint}</p>
            <FieldError>{errors[field.name]?.message}</FieldError>
          </div>
        ))}
      </section>

      <div className="bg-background/90 sticky bottom-4 flex justify-end rounded-2xl border p-3 shadow-xl backdrop-blur">
        <Button disabled={saving} type="submit" variant="accent">
          <Save className="size-4" /> {saving ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
