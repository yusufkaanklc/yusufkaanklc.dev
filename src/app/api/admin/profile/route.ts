import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/lib/models/Profile";
import { profileSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/profile");

export async function GET() {
  try {
    await connectDB();
    const profile = await Profile.findOne().lean();
    return NextResponse.json(profile);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const profile = await Profile.findOneAndUpdate({}, parsed.data, { new: true, upsert: true }).lean();
    return NextResponse.json(profile);
  } catch (err) {
    log.error("PUT failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
