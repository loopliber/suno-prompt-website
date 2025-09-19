
import React, { useState, useEffect, useCallback } from "react";
import { BlogPost } from "@/api/entities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ArrowRight, Filter, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { updateSEO, generateStructuredData, injectStructuredData } from "@/utils/seo.js";

const categories = [
  { value: "all", label: "All Posts" },
  { value: "beginner-guides", label: "Beginner Guides" },
  { value: "genre-prompts", label: "Genre Prompts" },
  { value: "artist-styles", label: "Artist Styles" },
  { value: "advanced-techniques", label: "Advanced Techniques" },
  { value: "updates", label: "Updates" },
];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // SEO setup for blog page
  useEffect(() => {
    if (selectedPost) {
      // Individual blog post SEO
      updateSEO({
        title: selectedPost.title,
        description: selectedPost.excerpt,
        url: `/blog/${selectedPost.slug}`,
        type: "article",
        publishedTime: selectedPost.created_date,
        tags: selectedPost.tags || [],
        author: "Suno Prompt Master"
      });

      const structuredData = generateStructuredData('article', {
        title: selectedPost.title,
        description: selectedPost.excerpt,
        url: `/blog/${selectedPost.slug}`,
        publishedTime: selectedPost.created_date,
        author: "Suno Prompt Master",
        tags: selectedPost.tags || []
      });
      
      injectStructuredData(structuredData);
    } else {
      // Blog listing page SEO
      updateSEO({
        title: "Suno AI Blog - Latest Music Generation Tips & Tutorials",
        description: "Discover the latest Suno AI music generation techniques, prompt engineering tips, and industry insights. Stay updated with our comprehensive blog.",
        url: "/blog",
        tags: ["suno ai blog", "music generation tips", "ai music tutorials", "prompt engineering", "music ai news"]
      });
    }
  }, [selectedPost]);
  
  const clearPostSelection = () => {
    setSelectedPost(null);
    window.history.pushState({}, '', createPageUrl('Blog'));
  }

  const loadSpecificPost = useCallback(async (slug, retries = 3) => {
    try {
      if (!BlogPost || typeof BlogPost.filter !== 'function') {
        if (retries > 0) {
          setTimeout(() => loadSpecificPost(slug, retries - 1), 500);
        } else { throw new Error("BlogPost entity failed to load."); }
        return;
      }
      const postList = await BlogPost.filter({ slug }, '-created_date', 1);
      if (postList.length > 0) {
        setSelectedPost(postList[0]);
      } else {
        clearPostSelection();
      }
    } catch (error) {
      console.error('Error loading specific post:', error);
    }
  }, []);

  const checkForPostParam = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    if (postSlug) {
      loadSpecificPost(postSlug);
    }
  }, [loadSpecificPost]);

  const loadPosts = useCallback(async (retries = 3) => {
    try {
      if (!BlogPost || typeof BlogPost.filter !== 'function') {
        if (retries > 0) {
          setTimeout(() => loadPosts(retries - 1), 500);
        } else { throw new Error("BlogPost entity failed to load."); }
        return;
      }
      const allPosts = await BlogPost.filter({ published: true }, '-created_date');
      setPosts(allPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading posts:', error);
      setLoading(false);
    }
  }, []);

  const filterPosts = useCallback(() => {
    let filtered = posts;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  useEffect(() => {
    loadPosts();
    checkForPostParam();
  }, [loadPosts, checkForPostParam]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  if (selectedPost) {
    return (
      <div className="min-h-screen text-white pt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            onClick={clearPostSelection}
            className="mb-8 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <header className="mb-12">
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border border-blue-500/30 capitalize">
                {selectedPost.category.replace('-', ' ')}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(selectedPost.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </header>

            <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:font-extrabold prose-headings:tracking-tighter prose-h2:text-3xl prose-h3:text-2xl prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-strong:text-white">
              <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
            </div>
          </motion.article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration: 0.5}}>
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
              SunoPrompt <span className="text-blue-400">Blog</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl">
              Your source for Suno AI mastery. Dive into guides, tutorials, and tips for creating next-level music.
            </p>
          </div>

          <div className="mb-12 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/5 border-white/10 h-12 rounded-lg text-base placeholder-slate-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`rounded-md transition-all ${selectedCategory === category.value 
                    ? "bg-blue-600 hover:bg-blue-700 border-blue-600" 
                    : "border-white/20 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl animate-pulse h-64"></div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
            <p className="text-slate-400">Try a different search or filter combination.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card 
                  onClick={() => setSelectedPost(post)}
                  className="bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                >
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <Badge className="w-fit mb-3 bg-blue-500/20 text-blue-400 border-blue-500/30 capitalize">
                      {post.category.replace('-', ' ')}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors flex-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
