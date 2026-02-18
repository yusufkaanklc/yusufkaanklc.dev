import { profile } from "@/data/profile";
import { neofetchArt } from "@/data/asciiArt";

export function Neofetch() {
  const info = [
    { label: "User", value: `${profile.username}@yusufkaanklc.dev` },
    { label: "Name", value: profile.name },
    { label: "Role", value: profile.title },
    { label: "Location", value: profile.location },
    { label: "Shell", value: "bash 5.2.0" },
    { label: "Terminal", value: "yusufkaanklc.dev v1.0" },
    { label: "Stack", value: "React, Next.js, TypeScript, Node.js" },
    { label: "Uptime", value: `${new Date().getFullYear() - 2022} years coding` },
  ];

  return (
    <div className="flex gap-6 flex-col sm:flex-row">
      <pre
        className="text-accent glow text-xs leading-snug shrink-0 whitespace-pre"
        style={{ fontFamily: 'Consolas, "Courier New", monospace', fontFeatureSettings: "'liga' 0, 'calt' 0, 'kern' 0", fontKerning: "none", fontVariantLigatures: "none" }}
      >
        {neofetchArt.join("\n")}
      </pre>
      <div className="space-y-0.5 text-sm">
        {info.map((item) => (
          <div key={item.label}>
            <span className="text-accent font-bold">{item.label}</span>
            <span className="text-fg-dim">: </span>
            <span className="text-fg-muted">{item.value}</span>
          </div>
        ))}
        <div className="flex gap-1 mt-2">
          {[
            "var(--accent)",
            "var(--accent-secondary)",
            "var(--red)",
            "var(--green)",
            "var(--yellow)",
            "var(--blue)",
          ].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
