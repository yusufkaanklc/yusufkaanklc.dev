import { cn } from "@/utils/cn";

export function GlowEffect({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-accent drop-shadow-[0_0_8px_var(--accent)]", className)}>
      {children}
    </span>
  );
}
