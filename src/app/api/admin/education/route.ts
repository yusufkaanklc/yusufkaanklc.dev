import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Education } from "@/lib/models/Education";

export async function GET() {
  await connectDB();
  const education = await Education.find().lean();
  return NextResponse.json(education);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const edu = await Education.create(body);
  return NextResponse.json(edu, { status: 201 });
}
