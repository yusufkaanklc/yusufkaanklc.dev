import { registerCommand } from "@/core/commandRegistry";
import { projects as staticProjects } from "@/data/projects";
import { ProjectCard } from "@/components/output/ProjectCard";

registerCommand({
  name: "projects",
  description: "View my projects",
  handler: (_args, context) => {
    const projects = context.data?.projects ?? staticProjects;
    return {
      output: [
        {
          id: `projects-header-${Date.now()}`,
          type: "component",
          component: <p className="text-accent font-bold mb-2">Projects:</p>,
        },
        ...projects.map((project, i) => ({
          id: `project-${i}-${Date.now()}`,
          type: "component" as const,
          component: <ProjectCard project={project} />,
        })),
      ],
    };
  },
});
