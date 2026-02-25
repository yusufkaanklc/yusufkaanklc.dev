import "dotenv/config";
import mongoose from "mongoose";
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { blogPosts } from "../data/blog";
import { skillCategories } from "../data/skills";
import { experiences } from "../data/experience";
import { educationList, certificates } from "../data/education";
import { contact } from "../data/contact";
import { socials } from "../data/socials";
import { announcements } from "../data/announcements";
import { news } from "../data/news";

import { Profile } from "./models/Profile";
import { Project } from "./models/Project";
import { BlogPost } from "./models/BlogPost";

import { SkillCategory } from "./models/SkillCategory";
import { Experience } from "./models/Experience";
import { Education } from "./models/Education";
import { Certificate } from "./models/Certificate";
import { Contact } from "./models/Contact";
import { Social } from "./models/Social";
import { Announcement } from "./models/Announcement";
import { NewsArticle } from "./models/News";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env");
  process.exit(1);
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  // Clear existing data
  await Promise.all([
    Profile.deleteMany({}),
    Project.deleteMany({}),
    BlogPost.deleteMany({}),
    SkillCategory.deleteMany({}),
    Experience.deleteMany({}),
    Education.deleteMany({}),
    Certificate.deleteMany({}),
    Contact.deleteMany({}),
    Social.deleteMany({}),
    Announcement.deleteMany({}),
    NewsArticle.deleteMany({}),
  ]);
  console.log("Cleared existing data.");

  // Seed profile
  await Profile.create(profile);
  console.log("Seeded profile.");

  // Seed projects
  await Project.insertMany(projects);
  console.log(`Seeded ${projects.length} projects.`);

  // Seed blog posts
  await BlogPost.insertMany(blogPosts);
  console.log(`Seeded ${blogPosts.length} blog posts.`);

  // Seed skill categories
  await SkillCategory.insertMany(skillCategories);
  console.log(`Seeded ${skillCategories.length} skill categories.`);

  // Seed experiences
  await Experience.insertMany(experiences);
  console.log(`Seeded ${experiences.length} experiences.`);

  // Seed education
  await Education.insertMany(educationList);
  console.log(`Seeded ${educationList.length} education entries.`);

  // Seed certificates
  await Certificate.insertMany(certificates);
  console.log(`Seeded ${certificates.length} certificates.`);

  // Seed contact
  await Contact.create(contact);
  console.log("Seeded contact.");

  // Seed socials
  await Social.insertMany(socials);
  console.log(`Seeded ${socials.length} social links.`);

  // Seed announcements
  await Announcement.insertMany(announcements);
  console.log(`Seeded ${announcements.length} announcements.`);

  // Seed news
  await NewsArticle.insertMany(news);
  console.log(`Seeded ${news.length} news articles.`);

  console.log("\nSeed completed successfully!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
