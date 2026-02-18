export interface Education {
  degree: string;
  school: string;
  period: string;
  description?: string;
}

export const educationList: Education[] = [
  {
    degree: "Computer Programming",
    school: "Kayseri Universitesi",
    period: "2022 - 2024",
    description: "Associate degree in Computer Programming.",
  },
];

export interface Certificate {
  name: string;
  issuer: string;
}

export const certificates: Certificate[] = [
  { name: "Intermediate Frontend Development", issuer: "Patika.dev" },
  { name: "Backend Development With Node.js", issuer: "Patika.dev" },
  { name: "Solidity & BNB Chain Development", issuer: "Rise In" },
];
