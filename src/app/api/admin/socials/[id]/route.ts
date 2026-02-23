import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Social } from "@/lib/models/Social";
import { socialSchema } from "@/lib/validations";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";

const log = logger("api/admin/socials/[id]");

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const body = await request.json();
    const parsed = socialSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const social = await Social.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!social) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(social);
  } catch (err) {
    log.error("PUT failed", err);
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
    const social = await Social.findByIdAndDelete(id);
    if (!social) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    log.error("DELETE failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
