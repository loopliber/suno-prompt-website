import React, { useState, useEffect, useCallback } from "react";
import { BlogPost } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { updateSEO, generateStructuredData, injectStructuredData } from "@/utils/seo.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Music, Zap, BookOpen, TrendingUp, Users, Star, ChevronsRight } from "lucide-react";
// Temporarily disable framer-motion to fix useLayoutEffect error
// import { motion } from "framer-motion";

// Temporary motion replacement
const motion = {
  div: 'div',
  section: 'section',
  h1: 'h1',
  p: 'p'
};

export default function Homepage() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEO setup for homepage
  useEffect(() => {
    updateSEO({
      title: "Best Suno AI Prompts Generator - Free Prompt Examples & Tips Guide",
      description: "Free Suno prompt generator with best AI prompts, examples, and tips. Super Suno prompt guide for creating amazing music. Get the best Suno AI prompts and techniques.",
      url: "/",
      tags: ["suno prompt generator", "suno prompt examples", "super suno prompt", "suno prompt tips", "suno prompt free", "best suno ai prompts", "suno ai prompts guide", "free suno prompts", "suno ai generator", "music ai prompts"]
    });

    const structuredData = generateStructuredData('website', {
      title: "Best Suno AI Prompts Generator - Free Examples & Guide",
      description: "Free Suno prompt generator with best AI prompts, examples, and tips. Super Suno prompt guide for creating amazing music.",
      url: "/"
    });
    
    injectStructuredData(structuredData);
  }, []);

  const loadFeaturedPosts = useCallback(async (retries = 3) => {
    try {
      // The BlogPost SDK might not be initialized on first render.
      // We'll check for it and retry a few times if it's not ready.
      if (!BlogPost || typeof BlogPost.filter !== 'function') {
        if (retries > 0) {
          console.log('BlogPost entity not ready, retrying...');
          setTimeout(() => loadFeaturedPosts(retries - 1), 500);
        } else {
          throw new Error("BlogPost entity failed to load.");
        }
        return;
      }
      
      const posts = await BlogPost.filter({ featured: true }, '-created_date', 3);
      setFeaturedPosts(posts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading featured posts:', error);
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    loadFeaturedPosts();
  }, [loadFeaturedPosts]); // Dependency array includes loadFeaturedPosts

  const stats = [
    { label: "Free Suno Prompts", value: "500+", icon: Music },
    { label: "Prompt Examples", value: "100+", icon: Sparkles },
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Prompt Tips", value: "25+", icon: BookOpen },
  ];

  return (
    <div className="text-white pt-16 sm:pt-24">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div>
              <Badge className="mb-6 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-1 text-sm">
                Free Suno Prompt Generator & Best AI Prompts Guide
              </Badge>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter">
                Best Suno AI Prompts
                <br />
                <span className="text-blue-400">Generator & Examples</span>
              </h1>
              <p className="text-lg text-slate-400 mt-6 max-w-3xl mx-auto">
                Free Suno prompt generator with super Suno prompt examples and expert tips. Create amazing music with our best Suno AI prompts guide and proven techniques.
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            >
              <Link to={createPageUrl("Generator")}>
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg text-base font-semibold shadow-lg shadow-blue-500/20">
                  <Zap className="w-5 h-5 mr-2" />
                  Free Suno Prompt Generator
                </Button>
              </Link>
              <Link to={createPageUrl("Blog")}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-slate-300 hover:bg-white/10 hover:text-white px-6 py-6 rounded-lg text-base font-semibold">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Our Blog & Tips
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Why Choose Our Suno Prompt Generator?
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Get access to the best Suno AI prompts collection with expert tips and super Suno prompt examples for every music genre.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="text-blue-400 mb-4">
                <Zap className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Free Suno Prompt Generator</h3>
              <p className="text-slate-400">
                Access our completely free Suno prompt generator with hundreds of tested prompt examples and templates for instant music creation.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="text-blue-400 mb-4">
                <Star className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Suno AI Prompts Collection</h3>
              <p className="text-slate-400">
                Curated collection of the best Suno AI prompts that actually work. Each prompt is tested and optimized for maximum quality results.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="text-blue-400 mb-4">
                <BookOpen className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Suno Prompt Tips & Tutorials</h3>
              <p className="text-slate-400">
                Learn professional Suno prompt tips and techniques from our comprehensive blog articles. Master super Suno prompt creation in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
              >
                <div className="text-blue-400 mb-2">
                  <stat.icon className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Latest Suno Prompt Examples & Tips</h2>
            <p className="text-lg text-slate-400 max-w-2xl mt-2">
              Discover the latest super Suno prompt techniques, best AI prompts examples, and expert tips for creating professional-quality music.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl animate-pulse h-64"></div>
              ))
            ) : (
              featuredPosts.map((post, index) => (
                <div
                  key={post.id}
                >
                  <Link to={createPageUrl(`Blog?post=${post.slug}`)}>
                    <Card className="bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all duration-300 group h-full flex flex-col">
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="text-sm text-blue-400 font-medium mb-2 capitalize">
                          {post.category.replace('-', ' ')}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors flex-1">
                          {post.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl("Blog")}>
              <Button variant="ghost" size="lg" className="text-slate-300 hover:bg-white/10 hover:text-white">
                View All Posts <ChevronsRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Suno Prompt Examples Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Popular Suno Prompt Examples
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Try these super Suno prompt examples that create amazing results. Each prompt is crafted using our best Suno AI prompts techniques.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Badge className="mb-3 bg-blue-500/20 text-blue-400 border-blue-500/30">Pop Music</Badge>
              <h3 className="text-lg font-semibold mb-2">Upbeat Pop Hit</h3>
              <p className="text-slate-400 text-sm mb-3">
                "Upbeat pop song with catchy melody, electronic beats, female vocals, modern production, radio-friendly"
              </p>
              <div className="text-blue-400 text-xs">✨ Super Suno Prompt</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Badge className="mb-3 bg-purple-500/20 text-purple-400 border-purple-500/30">Hip-Hop</Badge>
              <h3 className="text-lg font-semibold mb-2">Trap Beat</h3>
              <p className="text-slate-400 text-sm mb-3">
                "Hard trap beat, 808 drums, dark atmosphere, heavy bass, rapid hi-hats, modern production"
              </p>
              <div className="text-blue-400 text-xs">🎵 Best AI Prompt</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Badge className="mb-3 bg-green-500/20 text-green-400 border-green-500/30">Electronic</Badge>
              <h3 className="text-lg font-semibold mb-2">Ambient Chill</h3>
              <p className="text-slate-400 text-sm mb-3">
                "Ambient electronic music, ethereal pads, soft percussion, meditative atmosphere, healing frequencies"
              </p>
              <div className="text-blue-400 text-xs">🌟 Free Prompt</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl("Generator")}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg text-base font-semibold">
                Generate More Suno Prompts Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Suno AI Prompts Blog CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white/5 border border-white/10 rounded-2xl p-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Complete Suno AI Prompts Blog
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Master super Suno prompt creation with our comprehensive blog articles. From beginner prompt examples to advanced techniques - get the best Suno AI prompts tips and strategies for free.
            </p>
            <Link to={createPageUrl("Blog")}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg text-base font-semibold shadow-lg shadow-blue-500/20">
                <BookOpen className="w-5 h-5 mr-2" />
                Read Free Suno Prompts Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}