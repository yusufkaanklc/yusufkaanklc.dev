import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/lib/models/Profile";
import { Project } from "@/lib/models/Project";
import { BlogPost } from "@/lib/models/BlogPost";
import { SkillCategory } from "@/lib/models/SkillCategory";
import { Experience } from "@/lib/models/Experience";
import { Education } from "@/lib/models/Education";
import { Certificate } from "@/lib/models/Certificate";
import { Contact } from "@/lib/models/Contact";
import { Social } from "@/lib/models/Social";

export async function GET() {
  try {
    await connectDB();

    const [profile, projects, blogPosts, skillCategories, experiences, educationList, certificates, contact, socials] =
      await Promise.all([
        Profile.findOne().lean(),
        Project.find().lean(),
        BlogPost.find({ published: true }).lean(),
        SkillCategory.find().lean(),
        Experience.find().lean(),
        Education.find().lean(),
        Certificate.find().lean(),
        Contact.findOne().lean(),
        Social.find().lean(),
      ]);

    return NextResponse.json({
      profile,
      projects,
      blogPosts,
      skillCategories,
      experiences,
      educationList,
      certificates,
      contact,
      socials,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
