import type {
  WithId,
  BlogPost,
  Announcement,
  Project,
  Experience,
  Education,
  Certificate,
  SkillCategory,
  Social,
  Profile,
  Contact,
} from "./models";

export interface Stats {
  projects: number;
  blogPosts: number;
  skills: number;
  experiences: number;
  education: number;
  certificates: number;
  socials: number;
  announcements: number;
}

export type BlogItem = WithId<BlogPost>;
export type AnnouncementItem = WithId<Announcement>;
export type ProjectItem = WithId<Project>;
export type SkillItem = WithId<SkillCategory>;
export type ExperienceItem = WithId<Experience>;
export type EduItem = WithId<Education>;
export type CertItem = WithId<Certificate>;
export type SocialItem = WithId<Social>;
export type ProfileData = Profile;
export type ContactData = Contact;
