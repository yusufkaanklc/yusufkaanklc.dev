import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SkillCategory } from "@/lib/models/SkillCategory";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const skill = await SkillCategory.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(skill);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const skill = await SkillCategory.findByIdAndDelete(id);
  if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
