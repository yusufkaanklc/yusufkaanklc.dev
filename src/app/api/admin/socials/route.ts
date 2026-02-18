import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Social } from "@/lib/models/Social";

export async function GET() {
  await connectDB();
  const socials = await Social.find().lean();
  return NextResponse.json(socials);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const social = await Social.create(body);
  return NextResponse.json(social, { status: 201 });
}
