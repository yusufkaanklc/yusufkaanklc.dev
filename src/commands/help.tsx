import { registerCommand } from "@/core/commandRegistry";
import { getAllCommands } from "@/core/commandRegistry";
import { HelpTable } from "@/components/output/HelpTable";

registerCommand({
  name: "help",
  description: "List all available commands",
  handler: () => {
    const commands = getAllCommands().filter((cmd) => cmd.hidden !== true);
    return {
      output: [
        {
          id: `help-${Date.now()}`,
          type: "component",
          component: <HelpTable commands={commands} />,
        },
      ],
    };
  },
});
