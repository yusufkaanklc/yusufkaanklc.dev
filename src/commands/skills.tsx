import { registerCommand } from "@/core/commandRegistry";
import { skillCategories as staticSkillCategories } from "@/data/skills";
import { SkillBar } from "@/components/output/SkillBar";
import { commandListOutput } from "@/utils/commandHelpers";

registerCommand({
  name: "skills",
  description: "View my technical skills",
  handler: (_args, context) => {
    const skillCategories = context.data?.skillCategories ?? staticSkillCategories;
    return {
      output: commandListOutput("skill", "Technical Skills:", skillCategories, (cat) => (
        <SkillBar category={cat} />
      )),
    };
  },
});
