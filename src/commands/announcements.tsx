import { registerCommand } from "@/core/commandRegistry";
import { announcements as staticAnnouncements } from "@/data/announcements";
import { AnnouncementEntry } from "@/components/output/AnnouncementEntry";

registerCommand({
  name: "announcements",
  description: "View announcements",
  handler: (_args, context) => {
    const all = context.data?.announcements ?? staticAnnouncements;
    const published = all.filter((a) => a.published);
    return {
      output: [
        {
          id: `ann-header-${Date.now()}`,
          type: "component",
          component: <p className="text-accent font-bold mb-2">Announcements:</p>,
        },
        ...(published.length === 0
          ? [{ id: `ann-empty-${Date.now()}`, type: "text" as const, content: "  No announcements yet." }]
          : published.map((a, i) => ({
              id: `ann-${i}-${Date.now()}`,
              type: "component" as const,
              component: <AnnouncementEntry announcement={a} />,
            }))),
      ],
    };
  },
});
