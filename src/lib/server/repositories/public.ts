import {
  Timestamp,
  type DocumentData,
  type Query,
} from "firebase-admin/firestore";

import type {
  AchievementDTO,
  CertificationDTO,
  EducationDTO,
  ExperienceDTO,
  MessageInput,
  NoteDTO,
  ProfileDTO,
  ProjectDTO,
  SiteSettingsDTO,
  SkillDTO,
} from "@/types";
import { adminDb } from "@/lib/server/firebase-admin";

import { COLLECTIONS } from "./collections";
import { toDTO, toFirestoreData } from "./serialization";

async function getMany<T>(query: Query<DocumentData>): Promise<T[]> {
  const snapshot = await query.get();
  return snapshot.docs.map((document) =>
    toDTO<T>({ ...document.data(), id: document.id }),
  );
}

async function getSingleton<T>(collection: string): Promise<T | null> {
  const document = await adminDb.collection(collection).doc("public").get();
  return document.exists
    ? toDTO<T>({ ...document.data(), id: document.id })
    : null;
}

export const publicRepository = {
  getProfile(): Promise<ProfileDTO | null> {
    return getSingleton<ProfileDTO>(COLLECTIONS.profiles);
  },

  getSiteSettings(): Promise<SiteSettingsDTO | null> {
    return getSingleton<SiteSettingsDTO>(COLLECTIONS.siteSettings);
  },

  getProjects(): Promise<ProjectDTO[]> {
    return getMany<ProjectDTO>(
      adminDb
        .collection(COLLECTIONS.projects)
        .where("status", "==", "published")
        .orderBy("order", "asc"),
    );
  },

  async getProjectBySlug(slug: string): Promise<ProjectDTO | null> {
    const results = await getMany<ProjectDTO>(
      adminDb
        .collection(COLLECTIONS.projects)
        .where("slug", "==", slug)
        .where("status", "==", "published")
        .limit(1),
    );
    return results[0] ?? null;
  },

  getNotes(): Promise<NoteDTO[]> {
    return getMany<NoteDTO>(
      adminDb
        .collection(COLLECTIONS.notes)
        .where("status", "==", "published")
        .orderBy("publishedAt", "desc"),
    );
  },

  async getNoteBySlug(slug: string): Promise<NoteDTO | null> {
    const results = await getMany<NoteDTO>(
      adminDb
        .collection(COLLECTIONS.notes)
        .where("slug", "==", slug)
        .where("status", "==", "published")
        .limit(1),
    );
    return results[0] ?? null;
  },

  getSkills(): Promise<SkillDTO[]> {
    return getMany<SkillDTO>(
      adminDb.collection(COLLECTIONS.skills).orderBy("order", "asc"),
    );
  },

  getExperience(): Promise<ExperienceDTO[]> {
    return getMany<ExperienceDTO>(
      adminDb.collection(COLLECTIONS.experiences).orderBy("order", "asc"),
    );
  },

  getEducation(): Promise<EducationDTO[]> {
    return getMany<EducationDTO>(
      adminDb.collection(COLLECTIONS.education).orderBy("order", "asc"),
    );
  },

  getCertifications(): Promise<CertificationDTO[]> {
    return getMany<CertificationDTO>(
      adminDb.collection(COLLECTIONS.certifications).orderBy("order", "asc"),
    );
  },

  getAchievements(): Promise<AchievementDTO[]> {
    return getMany<AchievementDTO>(
      adminDb.collection(COLLECTIONS.achievements).orderBy("order", "asc"),
    );
  },

  async submitMessage(
    input: MessageInput,
    metadata: { ipHash?: string; userAgent?: string } = {},
  ): Promise<{ id: string }> {
    const reference = adminDb.collection(COLLECTIONS.messages).doc();
    const now = Timestamp.now();
    await reference.create(
      toFirestoreData({
        id: reference.id,
        ...input,
        status: "unread",
        source: input.source ?? "portfolio",
        ipHash: metadata.ipHash ?? input.ipHash ?? null,
        userAgent: metadata.userAgent ?? input.userAgent ?? null,
        createdAt: now,
        updatedAt: now,
        createdBy: "public",
        updatedBy: "public",
      }),
    );
    return { id: reference.id };
  },
};
