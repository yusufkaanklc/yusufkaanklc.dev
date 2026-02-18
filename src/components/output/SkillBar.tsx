import { type SkillCategory } from "@/data/skills";

export function SkillBar({ category }: { category: SkillCategory }) {
  return (
    <div className="mb-3">
      <h3 className="text-accent font-bold mb-1">{category.name}</h3>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span key={skill} className="text-sm px-2 py-0.5 rounded bg-accent/8 text-fg-muted border border-accent/15">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
