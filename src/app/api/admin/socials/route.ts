import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Social } from "@/lib/models/Social";
import { socialSchema } from "@/lib/validations";

export async function GET() {
  await connectDB();
  const socials = await Social.find().lean();
  return NextResponse.json(socials);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = socialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const social = await Social.create(parsed.data);
    return NextResponse.json(social, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
