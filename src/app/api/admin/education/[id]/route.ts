import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Education } from "@/lib/models/Education";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const edu = await Education.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!edu) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(edu);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const edu = await Education.findByIdAndDelete(id);
  if (!edu) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
