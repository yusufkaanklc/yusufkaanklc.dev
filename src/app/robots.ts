import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/uploads/"],
      },
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "MJ12bot",
          "BLEXBot",
          "DataForSeoBot",
          "GPTBot",
          "CCBot",
          "Bytespider",
          "PetalBot",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://yusufkaanklc.dev/sitemap.xml",
  };
}
