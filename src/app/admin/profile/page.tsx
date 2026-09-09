import { ProfileForm } from "@/features/profile/profile-form";
import type { ProfileFormValues } from "@/features/profile/profile-form-schema";
import { getAdminFirestore } from "@/lib/server/firebase-admin";
import {
  sampleProfile,
  sampleSkills,
  sampleTimeline,
} from "@/lib/server/public-content";

export default async function AdminProfilePage() {
  const db = getAdminFirestore();
  const [
    profileDoc,
    skills,
    experiences,
    education,
    certifications,
    achievements,
  ] = await Promise.all([
    db.collection("profile").doc("public").get(),
    db.collection("skills").orderBy("sortOrder", "asc").get(),
    db.collection("experiences").orderBy("sortOrder", "asc").get(),
    db.collection("education").orderBy("sortOrder", "asc").get(),
    db.collection("certifications").orderBy("sortOrder", "asc").get(),
    db.collection("achievements").orderBy("sortOrder", "asc").get(),
  ]);
  const profile = { ...sampleProfile, ...(profileDoc.data() ?? {}) };
  const values: ProfileFormValues = {
    name: String(profile.name),
    professionalTitle: String(profile.professionalTitle),
    shortIntroduction: String(profile.shortIntroduction),
    biography: String(profile.biography),
    location: String(profile.location),
    email: String(profile.email),
    profilePhotoUrl: String(profile.profilePhotoUrl ?? ""),
    resumeUrl: String(profile.resumeUrl ?? ""),
    availability: String(profile.availability),
    latestUpdate: String(profile.latestUpdate ?? ""),
    socialLinks: (profile.socialLinks as { label: string; url: string }[])
      .map((link) => `${link.label} | ${link.url}`)
      .join("\n"),
    skills: (skills.empty
      ? sampleSkills
      : skills.docs.map((doc) => ({
          category: doc.get("category"),
          name: doc.get("name"),
        }))
    )
      .map((skill) => `${skill.category} | ${skill.name}`)
      .join("\n"),
    experiences: (experiences.empty
      ? sampleTimeline.filter((item) => item.type === "experience")
      : experiences.docs.map((doc) => doc.data())
    )
      .map(
        (item) =>
          `${item.period} | ${item.title} | ${item.organization} | ${item.description}`,
      )
      .join("\n"),
    education: (education.empty
      ? sampleTimeline.filter((item) => item.type === "education")
      : education.docs.map((doc) => doc.data())
    )
      .map(
        (item) =>
          `${item.period} | ${item.title} | ${item.organization} | ${item.description}`,
      )
      .join("\n"),
    certifications: certifications.docs
      .map((doc) => {
        const url = String(doc.get("url") ?? "");
        const imageUrl = String(doc.get("imageUrl") ?? "");
        return `${doc.get("date")} | ${doc.get("title")} | ${doc.get("issuer")} | ${url} | ${imageUrl}`;
      })
      .join("\n"),
    achievements: achievements.docs
      .map((doc) => `${doc.get("title")} | ${doc.get("description")}`)
      .join("\n"),
  };

  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Identity</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Profile</h1>
      <p className="text-muted-foreground mt-2">
        Manage the biography, skills, background, credentials, links, photo, and
        résumé.
      </p>
      <div className="mt-8">
        <ProfileForm initialValues={values} />
      </div>
    </div>
  );
}
