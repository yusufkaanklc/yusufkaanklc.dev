import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "history",
  description: "Show command history",
  handler: (_args, context) => {
    if (context.history.length === 0) {
      return {
        output: [
          {
            id: `history-empty-${Date.now()}`,
            type: "text",
            content: "No commands in history.",
          },
        ],
      };
    }

    return {
      output: context.history.map((cmd, i) => ({
        id: `history-${i}-${Date.now()}`,
        type: "text" as const,
        content: `  ${String(i + 1).padStart(4)}  ${cmd}`,
      })),
    };
  },
});
