#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';

// Configurable base URL (fallback to env or placeholder)
const BASE_URL = process.env.SITE_BASE_URL || 'https://example.com';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const contentDir = path.join(projectRoot, 'src', 'content', 'guides');
const pagesDir = path.join(projectRoot, 'src', 'pages');

function safeRead(filePath) {
  try { return readFileSync(filePath, 'utf8'); } catch { return null; }
}

function collectMarkdownGuides() {
  if (!existsSync(contentDir)) return [];
  return readdirSync(contentDir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = safeRead(path.join(contentDir, f));
      if (!raw) return null;
      const { data } = matter(raw);
      const slug = data.slug || f.replace(/\.md$/, '');
      const lastmod = data.publishDate || new Date().toISOString();
      return { loc: `${BASE_URL}/guide/${slug}`, lastmod };
    })
    .filter(Boolean);
}

// Static top-level routes (ensure alignment with router)
const staticRoutes = [
  '/',
  '/guide',
  '/generator',
  '/blog'
];

function uniq(arr) { return [...new Set(arr)]; }

function generateXml(urls) {
  const lines = urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq || 'weekly'}</changefreq>\n    <priority>${u.priority || '0.7'}</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines}\n</urlset>\n`;
}

function main() {
  const now = new Date().toISOString();
  const guides = collectMarkdownGuides();
  const baseEntries = uniq(staticRoutes).map(r => ({ loc: `${BASE_URL}${r}`, lastmod: now, priority: r === '/' ? '1.0' : '0.8', changefreq: 'daily' }));
  const urls = [...baseEntries, ...guides];
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
  const xml = generateXml(urls);
  writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`Sitemap generated with ${urls.length} URLs`);
}

main();
