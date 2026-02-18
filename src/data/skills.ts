export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "TailwindCSS", "ChakraUI", "MantineUI", "Redux"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Express.js", "RESTful API", "WebSocket", "Nest.js", "Python"],
  },
  {
    name: "Database",
    skills: ["MongoDB", "MySQL", "MSSQL", "PostgreSQL"],
  },
  {
    name: "Tools & Design",
    skills: ["Git", "Figma", "Redux", "Jest", "Agile"],
  },
];
