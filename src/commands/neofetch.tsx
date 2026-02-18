import { registerCommand } from "@/core/commandRegistry";
import { Neofetch } from "@/components/output/Neofetch";

registerCommand({
  name: "neofetch",
  description: "Display system info",
  handler: () => ({
    output: [
      {
        id: `neofetch-${Date.now()}`,
        type: "component",
        component: <Neofetch />,
      },
    ],
  }),
});
