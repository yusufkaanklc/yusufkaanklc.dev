import { registerCommand } from "@/core/commandRegistry";
import { experiences } from "@/data/experience";
import { TimelineEntry } from "@/components/output/TimelineEntry";

registerCommand({
  name: "experience",
  description: "View my work experience",
  handler: () => ({
    output: [
      {
        id: `exp-header-${Date.now()}`,
        type: "component",
        component: <p className="text-accent font-bold mb-2">Work Experience:</p>,
      },
      ...experiences.map((exp, i) => ({
        id: `exp-${i}-${Date.now()}`,
        type: "component" as const,
        component: (
          <TimelineEntry
            period={exp.period}
            title={exp.role}
            subtitle={`${exp.company} — ${exp.location}`}
            description={exp.description}
          />
        ),
      })),
    ],
  }),
});
