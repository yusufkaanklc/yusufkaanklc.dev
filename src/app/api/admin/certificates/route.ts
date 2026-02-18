import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Certificate } from "@/lib/models/Certificate";

export async function GET() {
  await connectDB();
  const certificates = await Certificate.find().lean();
  return NextResponse.json(certificates);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const cert = await Certificate.create(body);
  return NextResponse.json(cert, { status: 201 });
}
