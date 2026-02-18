import { registerCommand } from "@/core/commandRegistry";
import { skillCategories } from "@/data/skills";
import { SkillBar } from "@/components/output/SkillBar";

registerCommand({
  name: "skills",
  description: "View my technical skills",
  handler: () => ({
    output: [
      {
        id: `skills-header-${Date.now()}`,
        type: "component",
        component: <p className="text-accent font-bold mb-2">Technical Skills:</p>,
      },
      ...skillCategories.map((cat, i) => ({
        id: `skill-${i}-${Date.now()}`,
        type: "component" as const,
        component: <SkillBar category={cat} />,
      })),
    ],
  }),
});
