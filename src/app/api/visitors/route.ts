import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/lib/models/Visitor";
import { getClientIp } from "@/lib/get-client-ip";
import { getIpGeo } from "@/lib/ip-geo";

export async function GET() {
  try {
    await connectDB();
    const count = await Visitor.countDocuments();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Failed to fetch visitor count" }, { status: 500 });
  }
}

export async function POST() {
  try {
    await connectDB();

    const headersList = await headers();
    const ip = getClientIp(headersList);

    const existing = await Visitor.findOne({ ip });
    if (existing) {
      existing.visitedAt = new Date();
      if (!existing.country) {
        const geo = await getIpGeo(ip);
        if (geo) Object.assign(existing, geo);
      }
      await existing.save();
    } else {
      const geo = await getIpGeo(ip);
      await Visitor.create({
        ip,
        visitedAt: new Date(),
        ...(geo && {
          country: geo.country,
          countryCode: geo.countryCode,
          city: geo.city,
          regionName: geo.regionName,
          isp: geo.isp,
        }),
      });
    }

    const count = await Visitor.countDocuments();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Failed to record visitor" }, { status: 500 });
  }
}
