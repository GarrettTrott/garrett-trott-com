const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiEntity<T> {
  id: number;
  documentId: string;
  attributes: T;
}

async function fetchFromStrapi<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`/api${endpoint}`, STRAPI_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(`Strapi fetch error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getProjects() {
  return fetchFromStrapi<StrapiResponse<StrapiEntity<Project>[]>>('/projects', {
    'populate': '*',
    'sort': 'order:asc',
  });
}

export async function getProject(slug: string) {
  return fetchFromStrapi<StrapiResponse<StrapiEntity<Project>[]>>('/projects', {
    'filters[slug][$eq]': slug,
    'populate': '*',
  });
}

export async function getResume() {
  return fetchFromStrapi<StrapiResponse<StrapiEntity<Resume>>>('/resume', {
    'populate[experience][populate]': '*',
    'populate[education][populate]': '*',
    'populate[skills][populate]': '*',
  });
}

export async function getBlogPosts() {
  return fetchFromStrapi<StrapiResponse<StrapiEntity<BlogPost>[]>>('/blog-posts', {
    'populate[coverImage]': '*',
    'populate[topics]': '*',
    'sort': 'publishedAt:desc',
  });
}

export async function getBlogPost(slug: string) {
  return fetchFromStrapi<StrapiResponse<StrapiEntity<BlogPost>[]>>('/blog-posts', {
    'filters[slug][$eq]': slug,
    'populate[coverImage]': '*',
    'populate[topics]': '*',
  });
}

export async function getTopics() {
  return fetchFromStrapi<StrapiResponse<StrapiEntity<Topic>[]>>('/topics', {
    'sort': 'name:asc',
  });
}

export interface Project {
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: StrapiMedia;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export type SkillCategory = 'Software' | 'Hardware' | 'Building Systems' | 'Audio';

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  level?: number;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: StrapiMedia;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
  featured: boolean;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
      formats?: Record<string, { url: string; width: number; height: number }>;
    };
  } | null;
}

export function getStrapiMediaUrl(media: StrapiMedia | undefined): string | null {
  if (!media?.data?.attributes?.url) return null;
  const url = media.data.attributes.url;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}
