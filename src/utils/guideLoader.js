import matter from 'gray-matter';

// Vite will glob markdown files at build time
// Using ?raw query to import markdown as plain text (Vite preferred approach)
const guideModules = import.meta.glob('../content/guides/*.md', { eager: true, query: '?raw', import: 'default' });

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

export function listGuides() {
  const guides = Object.entries(guideModules).map(([path, raw]) => {
    const { data, content } = matter(raw);
    const slug = data.slug || slugFromPath(path);
    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      excerpt: data.excerpt || content.slice(0, 180) + '...',
      keywords: data.keywords || [],
      publishDate: data.publishDate || new Date().toISOString(),
      author: data.author || 'Suno Prompt Master',
      readingTimeMinutes: data.readingTimeMinutes || Math.max(2, Math.round(content.split(/\s+/).length / 180)),
      status: data.status || 'draft',
      schema: data.schema || {},
      content
    };
  }).filter(g => g.status === 'published')
    .sort((a,b) => new Date(b.publishDate) - new Date(a.publishDate));
  return guides;
}

export function getGuide(slug) {
  const all = listGuides();
  return all.find(g => g.slug === slug);
}
