import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { experiences } from "@/data/experience";
import { educationList } from "@/data/education";

export function SeoContent() {
  return (
    <div className="sr-only" aria-hidden="false">
      <h1>{profile.name} - {profile.title}</h1>
      <p>{profile.bio}</p>

      <section>
        <h2>Skills</h2>
        {skillCategories.map((cat) => (
          <div key={cat.name}>
            <h3>{cat.name}</h3>
            <ul>
              {cat.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        {projects.map((project) => (
          <article key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>Technologies: {project.tech.join(", ")}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>Experience</h2>
        {experiences.map((exp) => (
          <article key={exp.role + exp.company}>
            <h3>{exp.role} at {exp.company}</h3>
            <p>{exp.period}</p>
            <p>{exp.description}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        {educationList.map((edu) => (
          <article key={edu.degree + edu.school}>
            <h3>{edu.degree} at {edu.school}</h3>
            <p>{edu.period}</p>
            {edu.description && <p>{edu.description}</p>}
          </article>
        ))}
      </section>
    </div>
  );
}
