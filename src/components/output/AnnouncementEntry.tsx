import { type Announcement } from "@/data/announcements";

const priorityColors = {
  normal: "text-accent",
  important: "text-t-yellow",
  critical: "text-t-red",
};

export function AnnouncementEntry({ announcement }: { announcement: Announcement }) {
  const href = `/announcements/${announcement.slug}`;
  const color = priorityColors[announcement.priority];

  return (
    <div className="border-l-2 border-accent/30 pl-3 py-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-accent-secondary/60">[{announcement.date}]</span>
        <a
          href={href}
          className="text-accent font-bold hover:underline"
        >
          {announcement.title}
        </a>
        <span className={`text-xs font-medium capitalize ${color}`}>{announcement.priority}</span>
      </div>
      <p className="text-fg-dim text-sm mt-0.5">{announcement.summary}</p>
    </div>
  );
}
