export type ISODateString = string;
export type PublishStatus = "draft" | "published" | "archived";

export interface AuditFields<TDate = Date> {
  createdAt: TDate;
  updatedAt: TDate;
  createdBy: string;
  updatedBy: string;
}

export interface User<TDate = Date> extends AuditFields<TDate> {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: "admin" | "editor";
  disabled: boolean;
  lastLoginAt: TDate | null;
}

export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Profile<TDate = Date> extends AuditFields<TDate> {
  id: "main";
  name: string;
  headline: string;
  shortBio: string;
  bio: string;
  location: string;
  email: string;
  avatarMediaId: string | null;
  resumeUrl: string | null;
  availability: "available" | "limited" | "unavailable";
  socialLinks: SocialLink[];
}

export interface ProjectLink {
  label: string;
  url: string;
  kind: "live" | "source" | "case-study" | "other";
}

export interface Project<TDate = Date> extends AuditFields<TDate> {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  coverMediaId: string | null;
  galleryMediaIds: string[];
  featured: boolean;
  status: PublishStatus;
  order: number;
  publishedAt: TDate | null;
}

export interface Note<TDate = Date> extends AuditFields<TDate> {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverMediaId: string | null;
  status: PublishStatus;
  readingTimeMinutes: number;
  publishedAt: TDate | null;
}

export interface Skill<TDate = Date> extends AuditFields<TDate> {
  id: string;
  name: string;
  category: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
  icon: string | null;
  featured: boolean;
  order: number;
}

export interface Experience<TDate = Date> extends AuditFields<TDate> {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  summary: string;
  highlights: string[];
  technologies: string[];
  order: number;
}

export interface Education<TDate = Date> extends AuditFields<TDate> {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string;
  order: number;
}

export interface Certification<TDate = Date> extends AuditFields<TDate> {
  id: string;
  name: string;
  issuer: string;
  issuedAt: string;
  expiresAt: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  order: number;
}

export interface Achievement<TDate = Date> extends AuditFields<TDate> {
  id: string;
  title: string;
  issuer: string;
  awardedAt: string;
  description: string;
  url: string | null;
  order: number;
}

export interface Message<TDate = Date> extends AuditFields<TDate> {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  source: string;
  ipHash: string | null;
  userAgent: string | null;
}

export interface Media<TDate = Date> extends AuditFields<TDate> {
  id: string;
  name: string;
  contentType: string;
  size: number;
  bytes: Uint8Array;
  visibility: "private" | "public";
  status: "draft" | "published";
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string[];
  socialImageMediaId: string | null;
}

export interface SiteSettings<TDate = Date> extends AuditFields<TDate> {
  id: "main";
  siteName: string;
  siteUrl: string;
  locale: string;
  navigation: Array<{ label: string; href: string; order: number }>;
  seo: SeoSettings;
  contactEmail: string;
  maintenanceMode: boolean;
}

export type UserDTO = User<ISODateString>;
export type ProfileDTO = Profile<ISODateString>;
export type ProjectDTO = Project<ISODateString>;
export type NoteDTO = Note<ISODateString>;
export type SkillDTO = Skill<ISODateString>;
export type ExperienceDTO = Experience<ISODateString>;
export type EducationDTO = Education<ISODateString>;
export type CertificationDTO = Certification<ISODateString>;
export type AchievementDTO = Achievement<ISODateString>;
export type MessageDTO = Message<ISODateString>;
export type MediaDTO = Media<ISODateString>;
export type SiteSettingsDTO = SiteSettings<ISODateString>;

export interface SlugRegistry<TDate = Date> {
  slug: string;
  collection: "projects" | "notes";
  entityId: string;
  createdAt: TDate;
}
