import { registerCommand } from "@/core/commandRegistry";
import { profile as staticProfile } from "@/data/profile";

registerCommand({
  name: "resume",
  description: "Download my resume/CV",
  handler: (_args, context) => {
    const profile = context.data?.profile ?? staticProfile;
    return {
      output: [
        {
          id: `resume-${Date.now()}`,
          type: "component",
          component: (
            <div className="space-y-2">
              <p className="text-accent font-bold">Resume / CV</p>
              <p className="text-fg-muted text-sm">
                Click below to download my resume:
              </p>
              <a
                href={profile.resumeUrl}
                download="Yusuf_Kagan_Kilic_CV.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors text-sm"
              >
                <span>[Download PDF]</span>
              </a>
            </div>
          ),
        },
      ],
    };
  },
});
