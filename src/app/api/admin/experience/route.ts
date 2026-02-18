import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Experience } from "@/lib/models/Experience";

export async function GET() {
  await connectDB();
  const experiences = await Experience.find().lean();
  return NextResponse.json(experiences);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const experience = await Experience.create(body);
  return NextResponse.json(experience, { status: 201 });
}
