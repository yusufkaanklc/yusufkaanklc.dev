import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "date",
  description: "Display current date and time",
  handler: () => ({
    output: [
      {
        id: `date-${Date.now()}`,
        type: "text",
        content: new Date().toString(),
      },
    ],
  }),
});
