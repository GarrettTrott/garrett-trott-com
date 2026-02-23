export interface Project {
  title: string;
  slug: string;
  description: string;
  content?: string;
  thumbnail?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  order: number;
  featured: boolean;
}

export const projects: Project[] = [
  // Add your projects here, for example:
  // {
  //   title: 'My Project',
  //   slug: 'my-project',
  //   description: 'A brief description of the project.',
  //   technologies: ['Astro', 'TypeScript', 'Tailwind'],
  //   githubUrl: 'https://github.com/garretttrott/my-project',
  //   order: 1,
  //   featured: true,
  // },
];

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
