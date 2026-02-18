import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Social } from "@/lib/models/Social";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const social = await Social.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!social) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(social);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const social = await Social.findByIdAndDelete(id);
  if (!social) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
