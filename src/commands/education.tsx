import { registerCommand } from "@/core/commandRegistry";
import { educationList as staticEducationList, certificates as staticCertificates } from "@/data/education";
import { TimelineEntry } from "@/components/output/TimelineEntry";
import { commandListOutput, commandHeader, commandItems } from "@/utils/commandHelpers";

registerCommand({
  name: "education",
  description: "View my education & certificates",
  handler: (_args, context) => {
    const educationList = context.data?.educationList ?? staticEducationList;
    const certificates = context.data?.certificates ?? staticCertificates;
    return {
      output: [
        ...commandListOutput("edu", "Education:", educationList, (edu) => (
          <TimelineEntry
            period={edu.period}
            title={edu.degree}
            subtitle={edu.school}
            description={edu.description}
          />
        )),
        commandHeader("cert", "Certificates:"),
        ...commandItems("cert", certificates, (cert) => (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-accent-secondary">*</span>
            <span className="text-fg-muted">{cert.name}</span>
            <span className="text-fg-dim">({cert.issuer})</span>
          </div>
        )),
      ],
    };
  },
});
