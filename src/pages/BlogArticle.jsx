import React, { useMemo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Twitter, Facebook, LinkedinIcon, Copy, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/api/entities';

export default function BlogArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  // Calculate reading time
  useMemo(() => {
    if (post?.content) {
      const wordsPerMinute = 200;
      const wordCount = post.content.split(/\s+/).length;
      setReadingTime(Math.ceil(wordCount / wordsPerMinute));
    }
  }, [post]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareOnTwitter = () => {
    const text = `${shareTitle} - Essential guide for Suno AI music creation`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  useEffect(() => {
    // Load blog post by slug
    let cancelled = false;
    (async () => {
      try {
        const posts = await BlogPost.filter({ slug }, '-created_date', 1);
        if (posts.length > 0 && !cancelled) {
          setPost(posts[0]);
        }
      } catch (e) {
        console.error('Failed to load blog post', e);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/blog/${post.slug}`;

    document.title = `${post.title} | sunoprompter`;

    // Meta description
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', post.excerpt || '');

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Open Graph / Twitter meta tags
    const ensureMeta = (property, content, attr = 'property') => {
      if (!content) return;
      let tag = document.querySelector(`meta[${attr}='${property}']`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    
    ensureMeta('og:title', post.title);
    ensureMeta('og:description', post.excerpt);
    ensureMeta('og:type', 'article');
    ensureMeta('og:url', canonicalUrl);
    ensureMeta('og:site_name', 'sunoprompter');
    ensureMeta('twitter:card', 'summary_large_image');
    ensureMeta('twitter:title', post.title, 'name');
    ensureMeta('twitter:description', post.excerpt, 'name');
    ensureMeta('twitter:site', '@sunoprompter', 'name');

    // Enhanced JSON-LD Article Schema
    const scriptId = 'blog-json-ld';
    let script = document.getElementById(scriptId);
    if (script) script.remove();
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.created_date,
      dateModified: post.created_date,
      author: { 
        '@type': 'Person', 
        name: 'Suno AI Expert',
        url: origin
      },
      publisher: {
        '@type': 'Organization',
        name: 'sunoprompter',
        url: origin,
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/logo.png`,
          width: 200,
          height: 60
        }
      },
      keywords: (post.tags || []).join(', '),
      articleSection: post.category,
      wordCount: post.content ? post.content.split(/\s+/).length : 0,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      inLanguage: 'en-US'
    });
    document.head.appendChild(script);

    // Breadcrumb JSON-LD
    const breadcrumbId = 'blog-breadcrumb-json-ld';
    let breadcrumb = document.getElementById(breadcrumbId);
    if (breadcrumb) breadcrumb.remove();
    breadcrumb = document.createElement('script');
    breadcrumb.id = breadcrumbId;
    breadcrumb.type = 'application/ld+json';
    breadcrumb.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${origin}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl }
      ]
    });
    document.head.appendChild(breadcrumb);

    return () => {
      script?.remove();
      breadcrumb?.remove();
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            {/* Back button skeleton */}
            <div className="h-10 bg-white/10 rounded-lg w-32"></div>
            
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-blue-500/20 rounded-full w-24"></div>
              <div className="h-12 bg-white/10 rounded-lg w-full"></div>
              <div className="h-8 bg-white/10 rounded-lg w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-6 bg-white/5 rounded w-20"></div>
                <div className="h-6 bg-white/5 rounded w-16"></div>
                <div className="h-6 bg-white/5 rounded w-24"></div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-4 pt-8">
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
              <div className="h-4 bg-white/10 rounded w-4/5"></div>
              <div className="h-32 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-8 h-8 text-white/60" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-slate-400 mb-6 leading-relaxed">
              We couldn't find that blog post. It may have been moved or is still being crafted.
            </p>
          </div>
          <Link to="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Return to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Navigation Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/blog">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> 
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="py-8 sm:py-12">
          {/* Article Header */}
          <header className="mb-12 text-center sm:text-left">
            {/* Category Badge */}
            <div className="mb-6">
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 capitalize text-sm px-3 py-1.5 font-medium">
                {post.category.replace('-', ' ')}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-slate-400 text-sm mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.created_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-8">
                {post.tags.slice(0, 6).map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center gap-1.5 bg-white/5 text-slate-300 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Share */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-6 border-t border-white/10">
              <span className="text-slate-400 text-sm font-medium">Share:</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnTwitter}
                  className="border-white/20 text-slate-300 hover:text-white hover:border-blue-400 hover:bg-blue-500/10"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnFacebook}
                  className="border-white/20 text-slate-300 hover:text-white hover:border-blue-400 hover:bg-blue-500/10"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnLinkedIn}
                  className="border-white/20 text-slate-300 hover:text-white hover:border-blue-400 hover:bg-blue-500/10"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="border-white/20 text-slate-300 hover:text-white hover:border-blue-400 hover:bg-blue-500/10"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-12 prose-h1:first:mt-0
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-white
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-white
            prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-6 prose-h4:text-white
            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-em:text-slate-200
            prose-code:text-blue-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-200
            prose-ul:space-y-2 prose-ol:space-y-2
            prose-li:text-slate-300 prose-li:leading-relaxed
            prose-table:border-collapse prose-table:border prose-table:border-white/20
            prose-th:border prose-th:border-white/20 prose-th:bg-white/5 prose-th:p-3 prose-th:text-white
            prose-td:border prose-td:border-white/20 prose-td:p-3 prose-td:text-slate-300
            prose-img:rounded-lg prose-img:shadow-xl
            ">
            <ReactMarkdown
              components={{
                // Convert h1 to h2 for proper semantic hierarchy
                h1: ({node, ...props}) => (
                  <h2 className="text-3xl font-bold text-white mb-6 mt-12 first:mt-0 border-b border-white/10 pb-3" {...props}>
                    {props.children}
                  </h2>
                ),
                // Enhanced headings with better styling
                h2: ({node, ...props}) => (
                  <h3 className="text-2xl font-bold text-white mb-4 mt-10" {...props}>
                    {props.children}
                  </h3>
                ),
                h3: ({node, ...props}) => (
                  <h4 className="text-xl font-bold text-white mb-3 mt-8" {...props}>
                    {props.children}
                  </h4>
                ),
                // Enhanced paragraphs
                p: ({node, ...props}) => (
                  <p className="text-slate-300 leading-relaxed mb-6 text-lg" {...props}>
                    {props.children}
                  </p>
                ),
                // Enhanced lists
                ul: ({node, ...props}) => (
                  <ul className="space-y-3 mb-6" {...props}>
                    {props.children}
                  </ul>
                ),
                ol: ({node, ...props}) => (
                  <ol className="space-y-3 mb-6" {...props}>
                    {props.children}
                  </ol>
                ),
                li: ({node, ...props}) => (
                  <li className="text-slate-300 leading-relaxed pl-2" {...props}>
                    {props.children}
                  </li>
                ),
                // Enhanced blockquotes
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-blue-500 bg-blue-500/5 pl-6 py-4 my-6 rounded-r-lg italic text-slate-200" {...props}>
                    {props.children}
                  </blockquote>
                ),
                // Enhanced code blocks
                code: ({node, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <pre className="bg-slate-900 border border-white/10 rounded-lg p-4 overflow-x-auto mb-6">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="text-blue-300 bg-white/10 px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 sm:p-8 text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Ready to Create Amazing Music?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Try our interactive prompt generator to craft perfect Suno AI prompts and start making professional-quality music today.
              </p>
              <Link to="/generator">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                  Start Creating Music →
                </Button>
              </Link>
            </div>

            {/* Related Articles */}
            <div className="text-center">
              <Link to="/blog">
                <Button variant="outline" className="border-white/20 text-slate-300 hover:text-white hover:bg-white/10 px-6 py-2">
                  ← Explore More Guides
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}