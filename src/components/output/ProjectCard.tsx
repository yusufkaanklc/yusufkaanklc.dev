import type { Project } from "@/types/models";
import { TagList } from "@/components/ui/TagBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border border-fg-dim/15 rounded-lg p-4 hover:border-accent/30 transition-colors bg-bg-secondary/50">
      <h3 className="text-accent font-bold text-lg">{project.name}</h3>
      <p className="text-fg-muted mt-1">{project.description}</p>
      <div className="mt-2">
        <TagList tags={project.tech} />
      </div>
      <div className="flex gap-4 mt-3 text-sm">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-accent-secondary hover:underline">
            GitHub
          </a>
        )}
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
