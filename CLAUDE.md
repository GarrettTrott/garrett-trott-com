# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog site built with Astro (frontend) and Strapi (headless CMS). The site displays projects, blog posts, and a resume, all managed through Strapi's admin interface.

## Development Commands

```bash
# Run Astro frontend only (port 4321)
npm run dev

# Run Strapi CMS only (port 1337)
npm run dev:cms

# Run both Astro and Strapi concurrently
npm run dev:all

# Build Astro for production
npm run build

# Preview production build
npm run preview
```

### Strapi CMS Commands (from /cms directory)
```bash
npm run develop   # Start Strapi in watch mode
npm run build     # Build Strapi admin panel
npm run start     # Start Strapi without watch mode
```

## Architecture

### Frontend (Astro)
- `src/pages/` - Astro pages (index, projects, resume, blog)
- `src/components/` - Reusable Astro components (Header, Footer, BaseHead)
- `src/layouts/` - Page layouts (BlogPost)
- `src/lib/strapi.ts` - Strapi API client with typed interfaces for Projects, Resume, BlogPosts
- `src/content/blog/` - Local MDX blog posts (can be used alongside Strapi blog posts)
- `src/consts.ts` - Site-wide constants (SITE_TITLE, SITE_DESCRIPTION)

### CMS (Strapi at /cms)
- Self-hosted headless CMS using SQLite by default
- Admin panel at http://localhost:1337/admin
- API endpoints consumed by Astro at build time

### Content Types (to be created in Strapi)
- **Projects**: title, slug, description, content, thumbnail, technologies[], githubUrl, liveUrl, order, featured
- **Resume**: name, title, summary, email, location, linkedin, github, experience[], education[], skills[]
- **Blog Posts** (optional): title, slug, excerpt, content, coverImage, publishedAt

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `STRAPI_URL` - Strapi API URL (default: http://localhost:1337)
- `STRAPI_API_TOKEN` - Optional API token for protected content

## Key Integration Points

The `src/lib/strapi.ts` file handles all CMS communication:
- `getProjects()` / `getProject(slug)` - Fetch project data
- `getResume()` - Fetch resume data with nested experience/education/skills
- `getBlogPosts()` / `getBlogPost(slug)` - Fetch blog posts from Strapi
- `getStrapiMediaUrl()` - Convert Strapi media references to full URLs

Pages gracefully handle CMS unavailability by showing placeholder content.
