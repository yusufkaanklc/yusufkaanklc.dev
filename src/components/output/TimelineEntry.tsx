export function TimelineEntry({
  period,
  title,
  subtitle,
  description,
}: {
  period: string;
  title: string;
  subtitle: string;
  description?: string;
}) {
  return (
    <div className="flex gap-4 pb-4">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-1.5" />
        <div className="w-px flex-1 bg-fg-dim/20" />
      </div>
      <div className="pb-2">
        <span className="text-xs text-accent-secondary/80">{period}</span>
        <h3 className="text-accent font-bold">{title}</h3>
        <p className="text-fg-dim text-sm">{subtitle}</p>
        {description && <p className="text-fg-muted text-sm mt-1">{description}</p>}
      </div>
    </div>
  );
}
