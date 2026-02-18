import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Experience } from "@/lib/models/Experience";
import { experienceSchema } from "@/lib/validations";

export async function GET() {
  await connectDB();
  const experiences = await Experience.find().lean();
  return NextResponse.json(experiences);
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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
