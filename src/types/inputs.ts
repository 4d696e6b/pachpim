import type {
  Achievement,
  Certification,
  Education,
  Experience,
  Media,
  Message,
  Note,
  Profile,
  Project,
  SiteSettings,
  Skill,
  User,
} from "./domain";

type WithoutIdentityAndAudit<T> = Omit<
  T,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
>;

export type UserInput = WithoutIdentityAndAudit<User>;
export type ProfileInput = WithoutIdentityAndAudit<Profile>;
export type ProjectInput = WithoutIdentityAndAudit<Project>;
export type NoteInput = WithoutIdentityAndAudit<Note>;
export type SkillInput = WithoutIdentityAndAudit<Skill>;
export type ExperienceInput = WithoutIdentityAndAudit<Experience>;
export type EducationInput = WithoutIdentityAndAudit<Education>;
export type CertificationInput = WithoutIdentityAndAudit<Certification>;
export type AchievementInput = WithoutIdentityAndAudit<Achievement>;
export type MessageInput = Omit<
  WithoutIdentityAndAudit<Message>,
  "status" | "source" | "ipHash" | "userAgent"
> &
  Partial<Pick<Message, "source" | "ipHash" | "userAgent">>;
export type MediaInput = WithoutIdentityAndAudit<Media>;
export type SiteSettingsInput = WithoutIdentityAndAudit<SiteSettings>;
