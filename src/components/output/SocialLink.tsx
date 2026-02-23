import type { Social } from "@/types/models";

export function SocialLink({ social }: { social: Social }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-accent font-bold w-24">{social.name}</span>
      <a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fg-muted hover:text-accent-secondary transition-colors underline underline-offset-2"
      >
        {social.url}
      </a>
    </div>
  );
}
