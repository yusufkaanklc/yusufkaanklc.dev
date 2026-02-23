import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Education } from "@/lib/models/Education";
import { educationSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/education");

export async function GET() {
  try {
    await connectDB();
    const education = await Education.find().lean();
    return NextResponse.json(education);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = educationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const edu = await Education.create(parsed.data);
    return NextResponse.json(edu, { status: 201 });
  } catch (err) {
    log.error("POST failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
