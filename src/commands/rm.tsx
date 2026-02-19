"use client";

import { registerCommand } from "@/core/commandRegistry";
import { FakeDestruction } from "@/components/output/FakeDestruction";

registerCommand({
  name: "rm",
  description: "Remove files",
  hidden: true,
  handler: (args) => {
    const hasRf = args.some((a) => a.includes("r") && a.includes("f") && a.startsWith("-"));
    const hasRoot = args.includes("/") || args.includes("/*");

    if (hasRf && hasRoot) {
      return {
        output: [
          {
            id: `rm-rf-${Date.now()}`,
            type: "component" as const,
            component: <FakeDestruction />,
          },
        ],
      };
    }

    return {
      output: [
        {
          id: `rm-${Date.now()}`,
          type: "error" as const,
          content: "rm: this is a portfolio, not a real filesystem",
        },
      ],
    };
  },
});
