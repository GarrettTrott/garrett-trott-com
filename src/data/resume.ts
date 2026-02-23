export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export type SkillCategory = 'Software' | 'Hardware' | 'Building Systems' | 'Audio';

export interface Skill {
  name: string;
  category: SkillCategory;
  level?: number;
}

export interface Resume {
  name: string;
  title: string;
  summary: string;
  email: string;
  location: string;
  linkedin?: string;
  github?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export const resume: Resume = {
  name: 'Garrett Trott',
  title: '',
  summary: '',
  email: '',
  location: '',
  github: 'https://github.com/garretttrott',
  linkedin: '',
  experience: [
    // {
    //   company: 'Company Name',
    //   position: 'Role',
    //   startDate: '2024-01',
    //   current: true,
    //   description: 'What you do.',
    //   achievements: ['Achievement 1', 'Achievement 2'],
    // },
  ],
  education: [
    // {
    //   institution: 'University',
    //   degree: 'B.S.',
    //   field: 'Computer Science',
    //   startDate: '2018-08',
    //   endDate: '2022-05',
    // },
  ],
  skills: [
    // { name: 'TypeScript', category: 'Software' },
    // { name: 'Soldering', category: 'Hardware' },
  ],
};
