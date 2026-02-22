import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/lib/models/Visitor";
import { getClientIp } from "@/lib/get-client-ip";
import { getIpGeo } from "@/lib/ip-geo";
import { isBot } from "@/lib/is-bot";
import { getVisitorToken, generateVisitorToken, setVisitorTokenCookie } from "@/lib/visitor-token";

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
    if (isBot(headersList)) return NextResponse.json({ count: await Visitor.countDocuments() });

    const ip = getClientIp(headersList);
    const cfCountry = headersList.get("cf-ipcountry");

    let token = await getVisitorToken();
    let needsCookie = false;

    if (!token) {
      token = generateVisitorToken();
      needsCookie = true;
    }

    const existing = await Visitor.findOne({ token });
    if (existing) {
      existing.visitedAt = new Date();
      existing.ip = ip;
      if (!existing.country) {
        const geo = await getIpGeo(ip, cfCountry);
        if (geo) Object.assign(existing, geo);
      }
      await existing.save();
    } else {
      const geo = await getIpGeo(ip, cfCountry);
      await Visitor.create({
        token,
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
    const response = NextResponse.json({ count });

    if (needsCookie) {
      setVisitorTokenCookie(response, token);
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to record visitor" }, { status: 500 });
  }
}
