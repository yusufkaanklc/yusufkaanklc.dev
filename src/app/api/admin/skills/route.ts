import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SkillCategory } from "@/lib/models/SkillCategory";
import { skillCategorySchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/skills");

export async function GET() {
  try {
    await connectDB();
    const skills = await SkillCategory.find().lean();
    return NextResponse.json(skills);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = skillCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const skill = await SkillCategory.create(parsed.data);
    return NextResponse.json(skill, { status: 201 });
  } catch (err) {
    log.error("POST failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
