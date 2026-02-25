import type { Metadata } from "next";
import { cookies } from "next/headers";
import SwaggerUI from "./swagger-ui";
import PasswordGate from "./password-gate";

export const metadata: Metadata = {
  title: "API Documentation — yusufkaanklc.dev",
  robots: { index: false, follow: false },
};

export default async function ApiDocsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("swagger-token")?.value;
  const isAuthed = token === process.env.SWAGGER_PASSWORD;

  if (!isAuthed) {
    return <PasswordGate />;
  }

  return <SwaggerUI />;
}
