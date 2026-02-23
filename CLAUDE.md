# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog site built with Astro. Blog posts are authored as markdown files in an Obsidian vault (`site-content/` folder), projects and resume are defined as static TypeScript data.

## Development Commands

```bash
# Run Astro dev server (port 4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Frontend (Astro)
- `src/pages/` - Astro pages (index, projects, resume, posts, RSS)
- `src/components/` - Reusable Astro components (Header, Footer, BaseHead, GlassBackground)
- `src/layouts/` - Page layouts (BlogPost)
- `src/data/projects.ts` - Static project data with typed interfaces
- `src/data/resume.ts` - Static resume data with typed interfaces
- `src/consts.ts` - Site-wide constants (SITE_TITLE, SITE_DESCRIPTION)

### Content (Obsidian Vault)
- Blog posts live in the Obsidian vault at: `/Users/garretttrott/Sync/ObsidianVault/site-content/`
- Astro's content collection loader reads `.md` files from this folder at build time
- The path is configurable via `CONTENT_PATH` env var (see `src/content.config.ts`)

### Blog Post Frontmatter Schema
```yaml
---
title: Post Title
description: A short excerpt
pubDate: 2026-02-22
updatedDate: 2026-02-23       # optional
heroImage: /images/cover.png   # optional
tags:                          # optional
  - javascript
  - astro
featured: true                 # optional, defaults to false
---
```

### Static Data
- **Projects**: Defined in `src/data/projects.ts` — title, slug, description, technologies, links, etc.
- **Resume**: Defined in `src/data/resume.ts` — experience, education, skills with typed interfaces

## Content Creation

Write markdown files directly in your Obsidian vault's `site-content/` folder. Include the required frontmatter (title, description, pubDate) and the post will appear on the site at next build.

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `CONTENT_PATH` - (optional) Override the default Obsidian vault content path

## Deployment

The site deploys to Coolify at garretttrott.com. The `site-content/` folder from the Obsidian vault must be available at build time on the deployment server.
