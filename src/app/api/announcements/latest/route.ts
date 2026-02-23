import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/lib/models/Announcement";
import { logger } from "@/lib/logger";

const log = logger("api/announcements/latest");

export async function GET() {
  try {
    await connectDB();
    const announcement = await Announcement.findOne({ published: true })
      .sort({ createdAt: -1 })
      .select("_id title slug summary priority date")
      .lean();
    return NextResponse.json(announcement ?? null);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json(null);
  }
}
