import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "announcements",
  description: "View announcements",
  handler: () => {
    setTimeout(() => {
      window.location.href = "/announcements";
    }, 300);

    return {
      output: [
        {
          id: `ann-${Date.now()}`,
          type: "system" as const,
          content: "Redirecting to announcements...",
        },
      ],
    };
  },
});
