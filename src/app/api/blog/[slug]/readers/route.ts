import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { BlogReader } from "@/lib/models/BlogReader";
import { getClientIp } from "@/lib/get-client-ip";
import { getIpGeo } from "@/lib/ip-geo";
import { isBot } from "@/lib/is-bot";
import { getVisitorToken, generateVisitorToken, setVisitorTokenCookie } from "@/lib/visitor-token";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const count = await BlogReader.countDocuments({ blogPostId: post._id });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reader count" }, { status: 500 });
  }
}

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const headersList = await headers();
    if (isBot(headersList)) {
      const count = await BlogReader.countDocuments({ blogPostId: post._id });
      return NextResponse.json({ count });
    }

    const ip = getClientIp(headersList);
    const cfCountry = headersList.get("cf-ipcountry");

    let token = await getVisitorToken();
    let needsCookie = false;

    if (!token) {
      token = generateVisitorToken();
      needsCookie = true;
    }

    const existing = await BlogReader.findOne({ blogPostId: post._id, token });
    if (existing) {
      existing.readAt = new Date();
      existing.ip = ip;
      if (!existing.country) {
        const geo = await getIpGeo(ip, cfCountry);
        if (geo) Object.assign(existing, geo);
      }
      await existing.save();
    } else {
      const geo = await getIpGeo(ip, cfCountry);
      await BlogReader.create({
        blogPostId: post._id,
        token,
        ip,
        readAt: new Date(),
        ...(geo && {
          country: geo.country,
          countryCode: geo.countryCode,
          city: geo.city,
          regionName: geo.regionName,
          isp: geo.isp,
        }),
      });
    }

    const count = await BlogReader.countDocuments({ blogPostId: post._id });
    const response = NextResponse.json({ count });

    if (needsCookie) {
      setVisitorTokenCookie(response, token);
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to record reader" }, { status: 500 });
  }
}
