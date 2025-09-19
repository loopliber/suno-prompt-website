# Suno Prompt Website

A modern, responsive website for Suno AI music generation prompts and guides. Built with React, Vite, and Tailwind CSS.

## Features

- 🎵 Comprehensive Suno AI prompt guides
- 📝 Blog with music generation tips and techniques
- 🎨 Beautiful, responsive design
- ⚡ Fast performance with Vite
- 📱 Mobile-friendly interface
- 🚀 Optimized for Vercel deployment

## Running the app locally

```bash
npm install
npm run dev
```

## Building the app

```bash
npm run build
npm run preview
```

## Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite configuration and deploy

Or use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

```bash
npm run build
```

For more information and support, please contact Base44 support at app@base44.com.
\n+## SEO & Crawling
\n+The site includes several features to improve search engine visibility and structured understanding of content.\n+\n+### 1. Heading Structure\n+* Exactly one `<h1>` per page (hero or article title).\n+* Markdown `#` headings in guides/blog posts are remapped to `<h2>` during render to avoid multiple H1s.\n+* Generator functional sections include visually-hidden (`sr-only`) `<h2>` elements for semantic clarity.\n+\n+### 2. Dynamic Content (Guides & Blog)\n+* Markdown guides in `src/content/guides/` parsed via `gray-matter`.\n+* API-based guide sections + blog posts receive meta tags and JSON-LD on the client.\n+\n+### 3. Meta & Structured Data\n+* Canonical tag, meta description, Open Graph + Twitter Card tags injected for article/guide pages.\n+* JSON-LD Article + BreadcrumbList for guides.\n+\n+### 4. Sitemap Generation\n+* Script: `scripts/generate-sitemap.mjs` runs automatically after `npm run build`.\n+* Includes static routes + published markdown guides.\n+* Configure domain via environment variable: \n+  ```bash\n+  SITE_BASE_URL="https://your-domain.com" npm run build\n+  ```\n+\n+### 5. robots.txt\n+* Located in `public/robots.txt` and references the generated sitemap.\n+\n+### 6. Adding New Guides\n+Create a new file in `src/content/guides/` with frontmatter: `slug`, `title`, `description`, `publishDate`, `status: published`. Rebuild to include in sitemap.\n+\n+### 7. Manual Sitemap Regeneration\n+```bash\n+SITE_BASE_URL="https://your-domain.com" node scripts/generate-sitemap.mjs\n+```\n+Outputs to `dist/sitemap.xml`. Ensure deployment includes this file.\n+\n+### 8. Future Enhancements (Optional)\n+* Pre-render or static export of guide/article pages for immediate HTML meta presence.\n+* Dynamic Open Graph image generation.\n+* Tag/category hub pages for topical clusters.\n+\n+---\n*** End Patch