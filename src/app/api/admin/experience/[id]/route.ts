import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Experience } from "@/lib/models/Experience";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const experience = await Experience.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!experience) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(experience);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const experience = await Experience.findByIdAndDelete(id);
  if (!experience) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
