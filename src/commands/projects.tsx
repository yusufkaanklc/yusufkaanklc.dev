import { registerCommand } from "@/core/commandRegistry";
import { projects as staticProjects } from "@/data/projects";
import { ProjectCard } from "@/components/output/ProjectCard";
import { commandListOutput } from "@/utils/commandHelpers";

registerCommand({
  name: "projects",
  description: "View my projects",
  handler: (_args, context) => {
    const projects = context.data?.projects ?? staticProjects;
    return {
      output: commandListOutput("project", "Projects:", projects, (project) => (
        <ProjectCard project={project} />
      )),
    };
  },
});
