import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SkillCategory } from "@/lib/models/SkillCategory";

export async function GET() {
  await connectDB();
  const skills = await SkillCategory.find().lean();
  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const skill = await SkillCategory.create(body);
  return NextResponse.json(skill, { status: 201 });
}
