import { Helmet, HelmetProvider } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = "website",
  article = null 
}) => {
  const siteUrl = "https://sunoprompter.com";
  const defaultTitle = "sunoprompter - Best Suno AI Prompt Generator & Music Creation Guide";
  const defaultDescription = "Master Suno AI music generation with expert prompts, comprehensive guides, and professional techniques. Create amazing songs with our proven prompt library and tutorials.";
  const defaultImage = `${siteUrl}/og-image.jpg`;
  
  const finalTitle = title ? `${title} | sunoprompter` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalUrl = url || siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="author" content="sunoprompter" />
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content="sunoprompter" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sunoprompter" />
      <meta name="twitter:creator" content="@sunoprompter" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Article-specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author || "sunoprompter"} />
          <meta property="article:section" content={article.section} />
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#0D0D0D" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "Article" : "WebSite",
          "name": finalTitle,
          "description": finalDescription,
          "url": finalUrl,
          "image": finalImage,
          "publisher": {
            "@type": "Organization",
            "name": "sunoprompter",
            "url": siteUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/logo.png`,
              "width": 200,
              "height": 60
            }
          },
          ...(type === "article" && article ? {
            "headline": finalTitle,
            "datePublished": article.publishedTime,
            "dateModified": article.modifiedTime || article.publishedTime,
            "author": {
              "@type": "Person",
              "name": article.author || "sunoprompter Expert"
            },
            "keywords": keywords,
            "articleSection": article.section,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": finalUrl
            }
          } : {
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        })}
      </script>
    </Helmet>
  );
};

export { SEOHead, HelmetProvider };
export default SEOHead;