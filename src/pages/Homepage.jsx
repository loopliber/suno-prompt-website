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
      title: "Suno AI Prompt Master - Best Music Generation Prompts & Guides",
      description: "Master Suno AI music generation with expert prompts, comprehensive guides, and professional techniques. Create amazing songs with our proven prompt library and tutorials.",
      url: "/",
      tags: ["suno ai", "music generation", "ai prompts", "music prompts", "ai music", "song creation", "music ai", "prompt engineering", "suno prompts", "ai composer"]
    });

    const structuredData = generateStructuredData('website', {
      title: "Suno AI Prompt Master",
      description: "Master Suno AI music generation with expert prompts, comprehensive guides, and professional techniques.",
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
    { label: "Prompt Templates", value: "500+", icon: Music },
    { label: "AI Styles", value: "100+", icon: Sparkles },
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Guide Sections", value: "25+", icon: BookOpen },
  ];

  return (
    <div className="text-white pt-16 sm:pt-24">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div>
              <Badge className="mb-6 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-1 text-sm">
                The Ultimate Guide to Suno V3
              </Badge>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter">
                Craft Perfect Music 
                <br />
                with <span className="text-blue-400">AI Prompts</span>
              </h1>
              <p className="text-lg text-slate-400 mt-6 max-w-3xl mx-auto">
                Unlock professional-quality music generation. Master Suno AI with our comprehensive guides, interactive prompt generator, and expert techniques.
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            >
              <Link to={createPageUrl("Generator")}>
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg text-base font-semibold shadow-lg shadow-blue-500/20">
                  <Zap className="w-5 h-5 mr-2" />
                  Launch Prompt Generator
                </Button>
              </Link>
              <Link to={createPageUrl("Guide")}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-slate-300 hover:bg-white/10 hover:text-white px-6 py-6 rounded-lg text-base font-semibold">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read The Guide
                </Button>
              </Link>
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Latest from the Blog</h2>
            <p className="text-lg text-slate-400 max-w-2xl mt-2">
              Stay updated with the latest Suno AI techniques, prompt strategies, and music creation tips.
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

      {/* Prompt Guide CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white/5 border border-white/10 rounded-2xl p-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Go from Beginner to Pro
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Our complete guide covers everything from prompt anatomy to advanced song structure and style emulation. It's the only resource you'll need.
            </p>
            <Link to={createPageUrl("Guide")}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg text-base font-semibold shadow-lg shadow-blue-500/20">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore The Complete Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}