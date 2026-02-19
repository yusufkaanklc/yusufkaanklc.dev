import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/lib/models/Announcement";
import { announcementSchema } from "@/lib/validations";
import mongoose from "mongoose";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const body = await request.json();
    const parsed = announcementSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const announcement = await Announcement.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!announcement) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(announcement);
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as Record<string, unknown>).code === 11000) {
      return NextResponse.json({ error: { slug: ["Slug already exists"] } }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
