import { registerCommand } from "@/core/commandRegistry";
import { experiences as staticExperiences } from "@/data/experience";
import { TimelineEntry } from "@/components/output/TimelineEntry";
import { commandListOutput } from "@/utils/commandHelpers";

registerCommand({
  name: "experience",
  description: "View my work experience",
  handler: (_args, context) => {
    const experiences = context.data?.experiences ?? staticExperiences;
    return {
      output: commandListOutput("exp", "Work Experience:", experiences, (exp) => (
        <TimelineEntry
          period={exp.period}
          title={exp.role}
          subtitle={`${exp.company} — ${exp.location}`}
          description={exp.description}
        />
      )),
    };
  },
});
