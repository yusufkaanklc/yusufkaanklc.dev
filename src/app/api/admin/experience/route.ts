import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Experience } from "@/lib/models/Experience";
import { experienceSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/experience");

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find().lean();
    return NextResponse.json(experiences);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = experienceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const experience = await Experience.create(parsed.data);
    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    log.error("POST failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
