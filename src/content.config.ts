import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const contentPath = import.meta.env.CONTENT_PATH || '/Users/garretttrott/Sync/ObsidianVault/site-content';

const blog = defineCollection({
	loader: glob({ base: contentPath, pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional().default([]),
		featured: z.boolean().optional().default(false),
	}),
});

export const collections = { blog };
