import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "visitors",
  description: "Show total unique visitor count",
  handler: async () => {
    try {
      const res = await fetch("/api/visitors");
      const data = await res.json();
      return {
        output: [
          {
            id: `visitors-${Date.now()}`,
            type: "text" as const,
            content: `Total unique visitors: ${data.count}`,
          },
        ],
      };
    } catch {
      return {
        output: [
          {
            id: `visitors-err-${Date.now()}`,
            type: "error" as const,
            content: "Failed to fetch visitor count.",
          },
        ],
      };
    }
  },
});
