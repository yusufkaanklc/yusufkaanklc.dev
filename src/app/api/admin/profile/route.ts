import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/lib/models/Profile";

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne().lean();
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  await connectDB();
  const body = await request.json();
  const profile = await Profile.findOneAndUpdate({}, body, { new: true, upsert: true }).lean();
  return NextResponse.json(profile);
}
