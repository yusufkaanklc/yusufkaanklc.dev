import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/lib/models/Contact";

export async function GET() {
  await connectDB();
  const contact = await Contact.findOne().lean();
  return NextResponse.json(contact);
}

export async function PUT(request: Request) {
  await connectDB();
  const body = await request.json();
  const contact = await Contact.findOneAndUpdate({}, body, { new: true, upsert: true }).lean();
  return NextResponse.json(contact);
}
