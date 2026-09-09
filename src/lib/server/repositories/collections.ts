import type {
  AchievementDTO,
  CertificationDTO,
  EducationDTO,
  ExperienceDTO,
  MediaDTO,
  MessageDTO,
  NoteDTO,
  ProfileDTO,
  ProjectDTO,
  SiteSettingsDTO,
  SkillDTO,
  UserDTO,
} from "@/types";
import type {
  AchievementInput,
  CertificationInput,
  EducationInput,
  ExperienceInput,
  MediaInput,
  NoteInput,
  ProfileInput,
  ProjectInput,
  SiteSettingsInput,
  SkillInput,
  UserInput,
} from "@/types";

export interface CollectionDTOMap {
  users: UserDTO;
  profiles: ProfileDTO;
  projects: ProjectDTO;
  notes: NoteDTO;
  skills: SkillDTO;
  experiences: ExperienceDTO;
  education: EducationDTO;
  certifications: CertificationDTO;
  achievements: AchievementDTO;
  messages: MessageDTO;
  media: MediaDTO;
  siteSettings: SiteSettingsDTO;
}

export interface CollectionInputMap {
  users: UserInput;
  profiles: ProfileInput;
  projects: ProjectInput;
  notes: NoteInput;
  skills: SkillInput;
  experiences: ExperienceInput;
  education: EducationInput;
  certifications: CertificationInput;
  achievements: AchievementInput;
  messages: Omit<
    MessageDTO,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  >;
  media: MediaInput;
  siteSettings: SiteSettingsInput;
}

export type CollectionName = keyof CollectionDTOMap;
export type SluggedCollection = "projects" | "notes";

export const COLLECTIONS = {
  users: "users",
  profiles: "profile",
  projects: "projects",
  notes: "notes",
  skills: "skills",
  experiences: "experiences",
  education: "education",
  certifications: "certifications",
  achievements: "achievements",
  messages: "messages",
  media: "media",
  siteSettings: "siteSettings",
  slugRegistry: "slugReservations",
} as const;
