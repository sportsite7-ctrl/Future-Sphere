# Future Sphere

Future Sphere is an editorial-first publication about artificial intelligence and emerging technology. This repository contains the first responsive website prototype and the foundation for future integrations.

## Product direction
- Clear, international coverage of AI developments.
- Ukrainian-first prototype; English edition planned as a first-class language.
- Original summaries, useful context, and links to primary sources.
- News first. AI model and tool directories can be added in later phases.

## Stack
- Next.js App Router, React, TypeScript
- Custom responsive CSS design system
- GitHub for source control
- Vercel planned for hosting
- Supabase planned for articles, sources, categories, and localized versions
- Gemini API planned for assisted summarization and translation

## Run locally
Requires Node.js 20.9 or newer.
1. Run npm install.
2. Run npm run dev.
3. Open http://localhost:3000.
4. Run npm run build before deployment.

## Environment
Copy .env.example to .env.local when integrations are introduced. Keep real API keys and service-role secrets out of GitHub. Add production values through Vercel Environment Variables.

## Current prototype
All visible articles are demonstration content, not live reporting. No database, external API, authentication, or automated publishing is connected yet.

## Planned architecture
1. Finish and review responsive design.
2. Connect this repository to Vercel and verify production deployments.
3. Add Supabase tables for articles, localized variants, sources, categories, and tags.
4. Build a separate ingestion workflow for RSS/API collection, deduplication, editorial checks, summaries, and translation.
5. Add editorial review and source attribution before publishing.
6. Add metadata, sitemap, robots.txt, RSS, and structured data.
7. Launch after quality and source-rights checks.

## Structure
- src/app — routes, layout, metadata, global styles
- src/components — reusable UI
- src/lib — types and prototype content
- public — static brand assets
