"use client";

export function TerminalHeader({ currentPath }: { currentPath: string }) {
  return (
    <div className="flex items-center px-4 py-2.5 bg-bg-secondary border-b border-fg-dim/15 select-none shrink-0">
      <div className="flex gap-2 mr-4">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
      </div>
      <span className="text-xs text-fg-dim mx-auto tracking-wide">
        visitor@yusufkaanklc:{currentPath}
      </span>
    </div>
  );
}
