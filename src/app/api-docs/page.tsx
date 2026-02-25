import type { Metadata } from "next";
import SwaggerUI from "./swagger-ui";

export const metadata: Metadata = {
  title: "API Documentation — yusufkaanklc.dev",
  robots: { index: false, follow: false },
};

export default function ApiDocsPage() {
  return <SwaggerUI />;
}
