"use client";

import { useEffect, useRef } from "react";

export default function SwaggerUI() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Reset body styles so Swagger UI renders with its own defaults
    document.body.style.background = "#fafafa";
    document.body.style.color = "initial";
    document.body.style.fontFamily = "initial";

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/swagger-ui-dist@5/swagger-ui.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SwaggerUIBundle({
        url: "/api/openapi",
        dom_id: "#swagger-ui",
        deepLinking: true,
        filter: true,
        tagsSorter: "alpha",
        operationsSorter: "alpha",
      });
    };
    document.body.appendChild(script);
  }, []);

  return <div id="swagger-ui" ref={containerRef} />;
}
