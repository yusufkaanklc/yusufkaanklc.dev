import { registerCommand } from "@/core/commandRegistry";
import { educationList, certificates } from "@/data/education";
import { TimelineEntry } from "@/components/output/TimelineEntry";

registerCommand({
  name: "education",
  description: "View my education & certificates",
  handler: () => ({
    output: [
      {
        id: `edu-header-${Date.now()}`,
        type: "component",
        component: <p className="text-accent font-bold mb-2">Education:</p>,
      },
      ...educationList.map((edu, i) => ({
        id: `edu-${i}-${Date.now()}`,
        type: "component" as const,
        component: (
          <TimelineEntry
            period={edu.period}
            title={edu.degree}
            subtitle={edu.school}
            description={edu.description}
          />
        ),
      })),
      {
        id: `cert-header-${Date.now()}`,
        type: "component",
        component: <p className="text-accent font-bold mt-2 mb-2">Certificates:</p>,
      },
      ...certificates.map((cert, i) => ({
        id: `cert-${i}-${Date.now()}`,
        type: "component" as const,
        component: (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-accent-secondary">*</span>
            <span className="text-fg-muted">{cert.name}</span>
            <span className="text-fg-dim">({cert.issuer})</span>
          </div>
        ),
      })),
    ],
  }),
});
