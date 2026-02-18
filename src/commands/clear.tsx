import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "clear",
  description: "Clear the terminal",
  handler: () => ({
    output: [],
    clear: true,
  }),
});
