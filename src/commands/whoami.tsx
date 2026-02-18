import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "whoami",
  description: "Display current user",
  handler: () => ({
    output: [
      {
        id: `whoami-${Date.now()}`,
        type: "text",
        content: "visitor",
      },
    ],
  }),
});
