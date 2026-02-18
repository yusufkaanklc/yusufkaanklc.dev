import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Certificate } from "@/lib/models/Certificate";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const cert = await Certificate.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cert);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const cert = await Certificate.findByIdAndDelete(id);
  if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
