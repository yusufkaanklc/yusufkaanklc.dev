"use client";

export function TerminalHeader({ currentPath }: { currentPath: string }) {
  return (
    <div className="relative flex items-center px-4 py-2.5 bg-bg-secondary border-b border-fg-dim/15 select-none shrink-0">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-xs text-fg-dim tracking-wide pointer-events-none">
        visitor@yusufkaanklc:{currentPath}
      </span>
    </div>
  );
}
