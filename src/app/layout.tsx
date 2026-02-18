import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "Yusuf Kaan Kilic | Full Stack Developer",
    description:
      "Interactive terminal-style portfolio — Full Stack Developer specializing in modern web technologies.",
    url: "https://yusufkaanklc.dev",
    siteName: "yusufkaanklc.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yusuf Kaan Kilic | Full Stack Developer",
    description:
      "Interactive terminal-style portfolio — Full Stack Developer specializing in modern web technologies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
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

  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-bg-secondary text-fg">
        {children}
      </body>
    </html>
  );
}
