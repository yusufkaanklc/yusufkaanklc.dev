import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yusufkaanklc.dev"),
  applicationName: "yusufkaanklc.dev",
  title: "Yusuf Kaan Kilic | Full Stack Developer",
  description:
    "Interactive terminal-style portfolio of Yusuf Kaan Kilic — Full Stack Developer specializing in React, Next.js, TypeScript, and Node.js.",
  keywords: [
    "Yusuf Kaan Kilic",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Web Developer",
  ],
  authors: [{ name: "Yusuf Kaan Kilic" }],
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Yusuf Kaan Kilic | Full Stack Developer",
    description:
      "Interactive terminal-style portfolio — Full Stack Developer specializing in modern web technologies.",
    url: "https://yusufkaanklc.dev",
    siteName: "yusufkaanklc.dev",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yusuf Kaan Kilic | Full Stack Developer",
    description:
      "Interactive terminal-style portfolio — Full Stack Developer specializing in modern web technologies.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://yusufkaanklc.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yusuf Kaan Kilic",
    url: "https://yusufkaanklc.dev",
    jobTitle: "Full Stack Developer",
    sameAs: [
      "https://github.com/yusufkaanklc",
      "https://linkedin.com/in/yusufkaanklc",
    ],
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "yusufkaanklc.dev",
    url: "https://yusufkaanklc.dev",
    author: {
      "@type": "Person",
      name: "Yusuf Kaan Kilic",
    },
  };

  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="antialiased bg-bg-secondary text-fg">
        {children}
        <GoogleAnalytics gaId="G-2ZMVGH2PND" />
      </body>
    </html>
  );
}
