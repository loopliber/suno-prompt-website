// Sitemap generator utility
import { BlogPost, GuideSection } from "@/api/entities";

const SITE_URL = "https://sunoprompter.com";

export const generateSitemap = async () => {
  const staticRoutes = [
    {
      url: "",
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "1.0"
    },
    {
      url: "/blog",
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "0.9"
    },
    {
      url: "/guide",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.9"
    },
    {
      url: "/generator",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.8"
    }
  ];

  // Get dynamic blog post routes
  const blogPosts = await BlogPost.list();
  const blogRoutes = blogPosts.map(post => ({
    url: `/blog/${post.slug}`,
    lastmod: new Date(post.created_date).toISOString(),
    changefreq: "weekly",
    priority: "0.7"
  }));

  // Get dynamic guide section routes
  const guideSections = await GuideSection.list();
  const guideRoutes = guideSections.map(section => ({
    url: `/guide/${section.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    priority: "0.8"
  }));

  const allRoutes = [...staticRoutes, ...blogRoutes, ...guideRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${SITE_URL}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate and save sitemap (for build process)
export const saveSitemap = async () => {
  try {
    const sitemap = await generateSitemap();
    
    // In a real deployment, you'd write this to the public folder
    // For now, we'll return it for manual saving
    console.log('Generated sitemap:', sitemap);
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return null;
  }
};