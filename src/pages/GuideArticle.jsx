import React, { useMemo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link } from 'react-router-dom';
import { getGuide } from '@/utils/guideLoader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GuideSection } from '@/api/entities';

export default function GuideArticle() {
  const { slug } = useParams();
  const markdownGuide = useMemo(() => getGuide(slug), [slug]);
  const [apiFallback, setApiFallback] = useState(null);
  const guide = markdownGuide || apiFallback;

  useEffect(() => {
    // If no markdown guide, try API sections
    if (!markdownGuide && slug) {
      let cancelled = false;
      (async () => {
        try {
          const sections = await GuideSection.list('order');
          const match = sections.find(s => s.slug === slug);
          if (match && !cancelled) {
            const words = match.content ? match.content.split(/\s+/).length : 0;
            setApiFallback({
              slug: match.slug,
              title: match.title,
              description: (match.content || '').slice(0, 150) + (match.content && match.content.length > 150 ? '...' : ''),
              content: match.content || '',
              publishDate: new Date().toISOString(),
              author: 'Suno Prompt Master',
              keywords: [],
              readingTimeMinutes: Math.max(2, Math.round(words / 180)),
              schema: { section: 'Guide Section' },
              source: 'api'
            });
          }
        } catch (e) {
          console.error('API fallback load failed', e);
        }
      })();
      return () => { cancelled = true; };
    } else {
      setApiFallback(null);
    }
  }, [markdownGuide, slug]);

  useEffect(() => {
    if (!guide) return;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/guide/${guide.slug}`;

    document.title = `${guide.title} | Suno Guide`;

    // Meta description
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', guide.description || '');

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
    ensureMeta('og:title', guide.title);
    ensureMeta('og:description', guide.description);
    ensureMeta('og:type', 'article');
    ensureMeta('og:url', canonicalUrl);
    ensureMeta('twitter:card', 'summary');
    ensureMeta('twitter:title', guide.title, 'name');
    ensureMeta('twitter:description', guide.description, 'name');

    // JSON-LD Article
    const scriptId = 'guide-json-ld';
    let script = document.getElementById(scriptId);
    if (script) script.remove();
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      datePublished: guide.publishDate,
      author: { '@type': 'Person', name: guide.author },
      keywords: (guide.keywords || []).join(', '),
      articleSection: guide.schema?.section || 'Guide',
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }
    });
    document.head.appendChild(script);

    // Breadcrumb JSON-LD
    const breadcrumbId = 'guide-breadcrumb-json-ld';
    let breadcrumb = document.getElementById(breadcrumbId);
    if (breadcrumb) breadcrumb.remove();
    breadcrumb = document.createElement('script');
    breadcrumb.id = breadcrumbId;
    breadcrumb.type = 'application/ld+json';
    breadcrumb.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Guide', item: `${origin}/guide` },
        { '@type': 'ListItem', position: 2, name: guide.title, item: canonicalUrl }
      ]
    });
    document.head.appendChild(breadcrumb);

    return () => {
      script?.remove();
      breadcrumb?.remove();
    };
  }, [guide]);

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-white px-4">
        <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
        <p className="text-slate-400 mb-6">We couldn't find that guide. It may have been moved or is still in draft.</p>
        <Link to="/guide">
          <Button variant="outline" className="border-white/20 text-slate-300 hover:text-white">Return to Guide Index</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/guide">
          <Button variant="ghost" className="mb-8 text-slate-300 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Guides
          </Button>
        </Link>

        <article>
          <header className="mb-10">
            <p className="text-blue-400 uppercase tracking-wide text-sm font-medium mb-2">Guide</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">{guide.title}</h1>
            <div className="flex gap-4 text-slate-400 text-sm flex-wrap">
              <span>{new Date(guide.publishDate).toLocaleDateString()}</span>
              {guide.readingTimeMinutes && <span>{guide.readingTimeMinutes} min read</span>}
              {(guide.keywords || []).slice(0,4).map(k => (
                <span key={k} className="bg-white/5 px-2 py-1 rounded border border-white/10">{k}</span>
              ))}
            </div>
          </header>
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:font-extrabold prose-headings:tracking-tighter prose-h2:text-3xl prose-h3:text-2xl prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-strong:text-white">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h2 {...props} className="mt-12 first:mt-0">{props.children}</h2>,
              }}
            >{guide.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
