import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/lib/models/Contact";
import { contactSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/contact");

export async function GET() {
  try {
    await connectDB();
    const contact = await Contact.findOne().lean();
    return NextResponse.json(contact);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const contact = await Contact.findOneAndUpdate({}, parsed.data, { new: true, upsert: true }).lean();
    return NextResponse.json(contact);
  } catch (err) {
    log.error("PUT failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
