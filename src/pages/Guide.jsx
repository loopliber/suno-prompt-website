import React, { useState, useEffect, useMemo } from "react";
import { GuideSection } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, ArrowLeft, Zap } from "lucide-react";
// Temporarily disable framer-motion to fix useLayoutEffect error
// import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { listGuides } from '@/utils/guideLoader';

// Temporary motion replacement
const motion = {
  div: 'div',
  section: 'section',
  h1: 'h1',
  p: 'p'
};

export default function Guide() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const allSections = await GuideSection.list('order');
      setSections(allSections);
    } catch (error) {
      console.error('Error loading guide sections:', error);
    }
    setLoading(false);
  };

  const getMainSections = () => sections.filter(section => !section.parent_section);
  const getSubSections = (parentSlug) => sections.filter(section => section.parent_section === parentSlug);
  const guides = useMemo(() => listGuides(), []);

  return (
    <div className="min-h-screen text-white pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
              The Complete <span className="text-blue-400">Suno Guide</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl">
              From prompt structure to advanced techniques, master every aspect of Suno AI.
            </p>
          </div>
        </div>

        {/* Markdown Guides Section */}
        {guides.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold tracking-tighter mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              Latest Guides
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.slice(0,6).map(g => (
                <Link key={g.slug} to={`/guide/${g.slug}`} className="group block h-full">
                  <Card className="bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors text-lg leading-tight">
                        {g.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4 line-clamp-4">
                        {g.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                        <span>{new Date(g.publishDate).toLocaleDateString()}</span>
                        <span>{g.readingTimeMinutes} min read</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl animate-pulse h-64"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {getMainSections().map((section) => (
              <div
                key={section.id}
              >
                <h2 className="text-3xl font-bold tracking-tighter mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  {section.title}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link to={`/guide/${section.slug}`} className="block h-full">
                    <Card 
                      className="bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all duration-300 group h-full flex flex-col"
                    >
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
                          {section.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Read introduction <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  {getSubSections(section.slug).map(sub => (
                    <Link key={sub.id} to={`/guide/${sub.slug}`} className="block h-full">
                      <Card 
                        className="bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all duration-300 group h-full flex flex-col"
                      >
                        <CardContent className="p-6 flex-1 flex flex-col justify-between">
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {sub.title}
                          </h3>
                          <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform mt-4">
                            View section <ChevronRight className="w-4 h-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center bg-white/5 border border-white/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Ready to Create?</h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Put your new knowledge to the test. Use our prompt generator to start creating music instantly.
          </p>
          <Link to={createPageUrl("Generator")}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg text-base font-semibold shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 mr-2" />
              Launch Generator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}