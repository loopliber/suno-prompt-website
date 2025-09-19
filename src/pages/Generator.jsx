import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, RefreshCw, Music, Zap, Settings, Volume2, Edit3, ChevronsRight } from "lucide-react";
// Temporarily disable framer-motion to fix useLayoutEffect error
// import { motion } from "framer-motion";

// Temporary motion replacement
const motion = {
  div: 'div',
  section: 'section',
  h1: 'h1',
  p: 'p'
};

const genres = [ "Pop", "Rock", "Hip-Hop", "R&B", "Electronic", "Dance", "House", "Techno", "Ambient", "Jazz", "Blues", "Country", "Folk", "Indie", "Alternative", "Metal", "Punk", "Reggae", "Classical", "Orchestral", "Cinematic", "Lo-fi", "Trap", "Dubstep", "Synthwave", "Funk" ];
const moods = [ "Energetic", "Calm", "Happy", "Sad", "Uplifting", "Dark", "Mysterious", "Romantic", "Aggressive", "Peaceful", "Nostalgic", "Epic", "Dreamy", "Intense", "Playful", "Melancholic" ];
const instruments = [ "Guitar", "Piano", "Drums", "Bass", "Synthesizer", "Violin", "Saxophone", "Trumpet", "Flute", "Cello", "Harp", "Organ", "Accordion", "Harmonica", "Banjo", "Mandolin" ];
const tempos = [ "Very Slow (60-70 BPM)", "Slow (70-80 BPM)", "Moderate (80-100 BPM)", "Medium (100-120 BPM)", "Fast (120-140 BPM)", "Very Fast (140+ BPM)" ];

const CardWrapper = ({ children, title, icon }) => (
  <Card className="bg-white/5 border border-white/10 rounded-xl">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-base font-medium">
        {React.cloneElement(icon, { className: "w-5 h-5 text-blue-400" })}
        <span className="text-slate-200">{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default function Generator() {
  const [formData, setFormData] = useState({ genre: "", mood: [], artistStyle: "", tempo: "", instruments: [], lyrics: "", songStructure: "verse-chorus", customTags: "" });
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const handleMultiSelectToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generatePrompt = () => {
    let prompt = `[${formData.genre || 'pop'}]`;
    if (formData.artistStyle) prompt += ` [in the style of ${formData.artistStyle}]`;
    if (formData.mood.length > 0) prompt += ` [${formData.mood.join(', ').toLowerCase()}]`;
    if (formData.tempo) prompt += ` [${formData.tempo.split(' ')[0].toLowerCase()} tempo]`;
    if (formData.instruments.length > 0) prompt += ` [featuring ${formData.instruments.join(', ').toLowerCase()}]`;
    if (formData.customTags) prompt += ` [${formData.customTags.split(',').map(t => t.trim()).join(', ')}]`;

    if (formData.lyrics) {
      prompt += "\n\n";
      if (formData.songStructure === 'custom') {
        prompt += formData.lyrics;
      } else {
        const lines = formData.lyrics.split('\n');
        if (formData.songStructure === "verse-chorus") {
          prompt += `[Verse]\n${lines[0] || '...'}\n\n[Chorus]\n${lines[1] || '...'}`;
        } else if (formData.songStructure === "verse-bridge-chorus") {
          prompt += `[Verse]\n${lines[0] || '...'}\n\n[Bridge]\n${lines[1] || '...'}\n\n[Chorus]\n${lines[2] || '...'}`;
        }
      }
    }
    setGeneratedPrompt(prompt.trim());
  };
  
  const copyToClipboard = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Failed to copy text: ', err); }
  };

  const resetForm = () => {
    setFormData({ genre: "", mood: [], artistStyle: "", tempo: "", instruments: [], lyrics: "", songStructure: "verse-chorus", customTags: "" });
    setGeneratedPrompt("");
  };

  return (
    <div className="min-h-screen text-white pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
              Prompt <span className="text-blue-400">Generator</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl">
              Build your next masterpiece. Our interactive tool helps you construct the perfect Suno prompt, step by step.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <CardWrapper title="Core Style" icon={<Settings />}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-300 mb-2 block text-sm">Genre</Label>
                  <Select value={formData.genre} onValueChange={(v) => setFormData(p => ({...p, genre: v}))}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-11"><SelectValue placeholder="Select a genre" /></SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">{genres.map(g => <SelectItem key={g} value={g} className="text-white hover:!bg-blue-500/20">{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label className="text-slate-300 mb-2 block text-sm">Artist Style (Optional)</Label>
                  <Input placeholder="e.g., Daft Punk, Johnny Cash" value={formData.artistStyle} onChange={(e) => setFormData(p => ({...p, artistStyle: e.target.value}))} className="bg-white/5 border-white/10 h-11" />
                </div>
              </div>
            </CardWrapper>

            <CardWrapper title="Mood & Feel" icon={<Volume2 />}>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <Badge key={mood} variant={formData.mood.includes(mood) ? "default" : "outline"} onClick={() => handleMultiSelectToggle('mood', mood)} className={`cursor-pointer transition-all px-3 py-1 text-sm ${formData.mood.includes(mood) ? "bg-blue-600 border-blue-600 hover:bg-blue-700" : "border-white/20 text-slate-300 hover:border-blue-500/50 hover:text-white"}`}>{mood}</Badge>
                ))}
              </div>
            </CardWrapper>

            <CardWrapper title="Instrumentation & Tempo" icon={<Music />}>
              <div className="space-y-6">
                <div>
                    <Label className="text-slate-300 mb-2 block text-sm">Featured Instruments</Label>
                    <div className="flex flex-wrap gap-2">
                        {instruments.map((inst) => (
                            <Badge key={inst} variant={formData.instruments.includes(inst) ? "default" : "outline"} onClick={() => handleMultiSelectToggle('instruments', inst)} className={`cursor-pointer transition-all px-3 py-1 text-sm ${formData.instruments.includes(inst) ? "bg-purple-600 border-purple-600 hover:bg-purple-700" : "border-white/20 text-slate-300 hover:border-purple-500/50 hover:text-white"}`}>{inst}</Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="text-slate-300 mb-2 block text-sm">Tempo</Label>
                    <Select value={formData.tempo} onValueChange={(v) => setFormData(p => ({...p, tempo: v}))}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-11"><SelectValue placeholder="Select tempo" /></SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20">{tempos.map(t => <SelectItem key={t} value={t} className="text-white hover:!bg-blue-500/20">{t}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
              </div>
            </CardWrapper>
            
            <CardWrapper title="Lyrics & Structure" icon={<Edit3 />}>
                <div className="space-y-4">
                    <Select value={formData.songStructure} onValueChange={(v) => setFormData(p => ({...p, songStructure: v}))}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-11"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                          <SelectItem value="verse-chorus" className="text-white hover:!bg-blue-500/20">Verse → Chorus</SelectItem>
                          <SelectItem value="verse-bridge-chorus" className="text-white hover:!bg-blue-500/20">Verse → Bridge → Chorus</SelectItem>
                          <SelectItem value="custom" className="text-white hover:!bg-blue-500/20">Custom (Manual Tags)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder={formData.songStructure === 'custom' ? "Enter full lyrics with [Verse], [Chorus] tags..." : "Line 1: Verse lyrics...\nLine 2: Chorus lyrics..."} value={formData.lyrics} onChange={(e) => setFormData(p => ({...p, lyrics: e.target.value}))} className="bg-white/5 border-white/10 h-24" />
                </div>
            </CardWrapper>

             <CardWrapper title="Advanced & Custom Tags" icon={<Sparkles />}>
                <Input placeholder="Comma-separated, e.g., 8-bit, reverb, female vocalist" value={formData.customTags} onChange={(e) => setFormData(p => ({...p, customTags: e.target.value}))} className="bg-white/5 border-white/10 h-11" />
            </CardWrapper>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
                <div className="flex gap-2">
                    <Button onClick={generatePrompt} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold shadow-lg shadow-blue-500/20">
                        <ChevronsRight className="w-5 h-5 mr-2" /> Generate
                    </Button>
                    <Button onClick={resetForm} variant="outline" className="h-12 border-white/20 text-slate-300 hover:bg-white/10 hover:text-white">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
                <Card className="bg-black/50 border border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base font-medium">
                        <div className="flex items-center gap-3">
                           <Zap className="w-5 h-5 text-green-400" />
                            <span className="text-slate-200">Generated Prompt</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-slate-400 hover:text-white hover:bg-white/10">
                            <Copy className="w-4 h-4 mr-2" />{copied ? "Copied!" : "Copy"}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {generatedPrompt ? (
                    <div className="bg-black/50 rounded-lg p-4 border border-white/10 min-h-[200px]">
                        <pre className="text-sm text-green-300 whitespace-pre-wrap font-mono leading-relaxed">
                        {generatedPrompt}
                        </pre>
                    </div>
                    ) : (
                    <div className="text-center py-16 text-slate-500 border border-dashed border-white/20 rounded-lg">
                        <Zap className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>Your prompt will appear here</p>
                    </div>
                    )}
                </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}