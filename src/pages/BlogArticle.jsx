import React, { useMemo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/api/entities';

export default function BlogArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

    document.title = `${post.title} | Suno Blog`;

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

    // Open Graph / Twitter basic
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
    ensureMeta('twitter:card', 'summary');
    ensureMeta('twitter:title', post.title, 'name');
    ensureMeta('twitter:description', post.excerpt, 'name');

    // JSON-LD Article
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
      author: { '@type': 'Person', name: 'Suno Prompt Master' },
      keywords: (post.tags || []).join(', '),
      articleSection: 'Blog',
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }
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
        { '@type': 'ListItem', position: 1, name: 'Blog', item: `${origin}/blog` },
        { '@type': 'ListItem', position: 2, name: post.title, item: canonicalUrl }
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
      <div className="max-w-3xl mx-auto py-20 text-white px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded mb-4 w-1/4"></div>
          <div className="h-12 bg-white/10 rounded mb-6 w-3/4"></div>
          <div className="h-32 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-white px-4">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-slate-400 mb-6">We couldn't find that blog post. It may have been moved or is still in draft.</p>
        <Link to="/blog">
          <Button variant="outline" className="border-white/20 text-slate-300 hover:text-white">Return to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/blog">
          <Button variant="ghost" className="mb-8 text-slate-300 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Button>
        </Link>

        <article>
          <header className="mb-10">
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 border border-blue-500/30 capitalize">
              {post.category.replace('-', ' ')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">{post.title}</h1>
            <div className="flex gap-4 text-slate-400 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date(post.created_date).toLocaleDateString()}</span>
              </div>
              {post.tags && post.tags.slice(0,4).map(tag => (
                <span key={tag} className="bg-white/5 px-2 py-1 rounded border border-white/10">{tag}</span>
              ))}
            </div>
          </header>
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:font-extrabold prose-headings:tracking-tighter prose-h2:text-3xl prose-h3:text-2xl prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-strong:text-white">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h2 {...props} className="mt-12 first:mt-0">{props.children}</h2>,
              }}
            >{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}