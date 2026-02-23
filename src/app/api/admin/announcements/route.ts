import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/lib/models/Announcement";
import { announcementSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/announcements");

export async function GET() {
  try {
    await connectDB();
    const announcements = await Announcement.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(announcements);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = announcementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const announcement = await Announcement.create(parsed.data);
    return NextResponse.json(announcement, { status: 201 });
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as Record<string, unknown>).code === 11000) {
      return NextResponse.json({ error: { slug: ["Slug already exists"] } }, { status: 400 });
    }
    log.error("POST failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
