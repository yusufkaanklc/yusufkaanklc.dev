import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Certificate } from "@/lib/models/Certificate";
import { certificateSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/certificates");

export async function GET() {
  try {
    await connectDB();
    const certificates = await Certificate.find().lean();
    return NextResponse.json(certificates);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = certificateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const cert = await Certificate.create(parsed.data);
    return NextResponse.json(cert, { status: 201 });
  } catch (err) {
    log.error("POST failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
