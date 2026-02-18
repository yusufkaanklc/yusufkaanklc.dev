import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Education } from "@/lib/models/Education";
import { educationSchema } from "@/lib/validations";
import mongoose from "mongoose";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const body = await request.json();
    const parsed = educationSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const edu = await Education.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!edu) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(edu);
  } catch {
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
    const edu = await Education.findByIdAndDelete(id);
    if (!edu) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
