// SEO utilities for dynamic meta tag management

export const SEO_DEFAULTS = {
  siteName: "Suno Prompt Master",
  siteUrl: "https://suno-prompt-website.vercel.app",
  defaultTitle: "Suno AI Prompt Master - Best Music Generation Prompts & Guides",
  defaultDescription: "Master Suno AI music generation with expert prompts, comprehensive guides, and professional techniques. Create amazing songs with our proven prompt library and tutorials.",
  defaultImage: "https://suno-prompt-website.vercel.app/og-image.jpg",
  twitterHandle: "@sunoprompts",
  author: "Suno Prompt Master"
};

// Update document title and meta tags dynamically
export const updateSEO = ({ 
  title, 
  description, 
  image, 
  url, 
  type = "website",
  publishedTime,
  modifiedTime,
  tags = [],
  author 
}) => {
  const fullTitle = title ? `${title} | ${SEO_DEFAULTS.siteName}` : SEO_DEFAULTS.defaultTitle;
  const fullDescription = description || SEO_DEFAULTS.defaultDescription;
  const fullImage = image || SEO_DEFAULTS.defaultImage;
  const fullUrl = url ? `${SEO_DEFAULTS.siteUrl}${url}` : SEO_DEFAULTS.siteUrl;

  // Update document title
  document.title = fullTitle;

  // Helper function to update or create meta tags
  const updateMetaTag = (selector, content) => {
    let element = document.querySelector(selector);
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      const [attr, value] = selector.includes('property') 
        ? ['property', selector.split('="')[1].split('"')[0]]
        : ['name', selector.split('="')[1].split('"')[0]];
      element.setAttribute(attr, value);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  };

  // Update basic meta tags
  updateMetaTag('meta[name="description"]', fullDescription);
  updateMetaTag('meta[name="keywords"]', tags.join(', '));

  // Update Open Graph tags
  updateMetaTag('meta[property="og:title"]', fullTitle);
  updateMetaTag('meta[property="og:description"]', fullDescription);
  updateMetaTag('meta[property="og:image"]', fullImage);
  updateMetaTag('meta[property="og:url"]', fullUrl);
  updateMetaTag('meta[property="og:type"]', type);

  // Update Twitter tags
  updateMetaTag('meta[property="twitter:title"]', fullTitle);
  updateMetaTag('meta[property="twitter:description"]', fullDescription);
  updateMetaTag('meta[property="twitter:image"]', fullImage);

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', fullUrl);
  }

  // Add article-specific meta tags if it's an article
  if (type === 'article') {
    if (publishedTime) {
      updateMetaTag('meta[property="article:published_time"]', publishedTime);
    }
    if (modifiedTime) {
      updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
    }
    if (author) {
      updateMetaTag('meta[property="article:author"]', author);
    }
    tags.forEach(tag => {
      updateMetaTag('meta[property="article:tag"]', tag);
    });
  }
};

// Generate structured data for different content types
export const generateStructuredData = (type, data) => {
  const baseStructure = {
    "@context": "https://schema.org"
  };

  switch (type) {
    case 'article':
      return {
        ...baseStructure,
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "image": data.image || SEO_DEFAULTS.defaultImage,
        "author": {
          "@type": "Person",
          "name": data.author || SEO_DEFAULTS.author
        },
        "publisher": {
          "@type": "Organization",
          "name": SEO_DEFAULTS.siteName,
          "logo": {
            "@type": "ImageObject",
            "url": `${SEO_DEFAULTS.siteUrl}/logo.png`
          }
        },
        "datePublished": data.publishedTime,
        "dateModified": data.modifiedTime || data.publishedTime,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${SEO_DEFAULTS.siteUrl}${data.url}`
        }
      };

    case 'guide':
      return {
        ...baseStructure,
        "@type": "HowTo",
        "name": data.title,
        "description": data.description,
        "image": data.image || SEO_DEFAULTS.defaultImage,
        "author": {
          "@type": "Person",
          "name": data.author || SEO_DEFAULTS.author
        },
        "publisher": {
          "@type": "Organization",
          "name": SEO_DEFAULTS.siteName
        },
        "datePublished": data.publishedTime,
        "step": data.steps?.map((step, index) => ({
          "@type": "HowToStep",
          "position": index + 1,
          "name": step.title,
          "text": step.content
        })) || []
      };

    case 'website':
      return {
        ...baseStructure,
        "@type": "Website",
        "name": SEO_DEFAULTS.siteName,
        "description": SEO_DEFAULTS.defaultDescription,
        "url": SEO_DEFAULTS.siteUrl,
        "publisher": {
          "@type": "Organization",
          "name": SEO_DEFAULTS.siteName
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SEO_DEFAULTS.siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };

    default:
      return baseStructure;
  }
};

// Inject structured data into the page
export const injectStructuredData = (structuredData) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

// Generate breadcrumb structured data
export const generateBreadcrumbs = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${SEO_DEFAULTS.siteUrl}${crumb.url}`
    }))
  };
};

// SEO-friendly URL slug generator
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Extract keywords from content
export const extractKeywords = (content, maxKeywords = 10) => {
  // Basic keyword extraction - could be enhanced with NLP libraries
  const words = content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const frequency = {};
  
  words.forEach(word => {
    if (!['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'has', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};