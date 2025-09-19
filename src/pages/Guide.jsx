import React, { useState, useEffect } from "react";
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

// Temporary motion replacement
const motion = {
  div: 'div',
  section: 'section',
  h1: 'h1',
  p: 'p'
};

export default function Guide() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
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
  const findSectionBySlug = (slug) => sections.find(s => s.slug === slug);

  if (selectedSection) {
    const parent = selectedSection.parent_section ? findSectionBySlug(selectedSection.parent_section) : selectedSection;
    const subSections = parent ? getSubSections(parent.slug) : [];
    
    return (
      <div className="min-h-screen text-white pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            onClick={() => setSelectedSection(null)}
            className="mb-8 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Sections
          </Button>

          <div className="grid lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-3">
              <div className="sticky top-24">
                <h3 className="font-semibold mb-4 text-blue-400">
                  {parent ? parent.title : 'Guide Sections'}
                </h3>
                <div className="space-y-2">
                  {parent && (
                    <Button
                      variant={selectedSection.id === parent.id ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-left h-auto py-2 ${selectedSection.id === parent.id ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                      onClick={() => setSelectedSection(parent)}
                    >
                      {parent.title}
                    </Button>
                  )}
                  {subSections.map((sub) => (
                    <Button
                      key={sub.id}
                      variant={selectedSection.id === sub.id ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-left h-auto py-2 pl-8 ${selectedSection.id === sub.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      onClick={() => setSelectedSection(sub)}
                    >
                      {sub.title}
                    </Button>
                  ))}
                </div>
              </div>
            </aside>

                        <main 
              key={selectedSection.id}
              className="lg:col-span-9"
            >
              <article>
                <header className="mb-8 border-b border-white/10 pb-8">
                  <Badge className="mb-4 bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Section {selectedSection.order}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                    {selectedSection.title}
                  </h1>
                </header>

                <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:font-extrabold prose-headings:tracking-tighter prose-h2:text-3xl prose-h3:text-2xl prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-strong:text-white">
                  <ReactMarkdown>{selectedSection.content}</ReactMarkdown>
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>
    );
  }

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

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl animate-pulse h-64"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {getMainSections().map((section, index) => (
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
                  <Card 
                    className="bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                    onClick={() => setSelectedSection(section)}
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
                  {getSubSections(section.slug).map(sub => (
                    <Card 
                      key={sub.id}
                      className="bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                      onClick={() => setSelectedSection(sub)}
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