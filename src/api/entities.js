// Mock data for blog posts
const mockBlogPosts = [
  {
    id: 1,
    title: "Getting Started with Suno AI Music Generation",
    slug: "getting-started-suno-ai",
    excerpt: "Learn the basics of creating amazing music with Suno AI. Perfect for beginners looking to dive into AI-powered music creation.",
    content: `# Getting Started with Suno AI Music Generation

Welcome to the world of AI music creation! Suno AI is a powerful tool that allows you to generate high-quality music from simple text prompts.

## What You'll Learn

- How to write effective prompts
- Understanding music styles and genres
- Tips for better results
- Common mistakes to avoid

## Your First Song

Start with simple prompts like:
- "upbeat pop song about summer"
- "relaxing acoustic guitar melody"
- "energetic rock anthem"

Remember to be specific about the mood, genre, and instruments you want!`,
    category: "beginner-guides",
    featured: true,
    created_date: "2024-01-15",
    tags: ["beginner", "tutorial", "basics"]
  },
  {
    id: 2,
    title: "Advanced Prompt Engineering for Suno",
    slug: "advanced-prompt-engineering",
    excerpt: "Master the art of prompt engineering to create professional-quality music with Suno AI.",
    content: `# Advanced Prompt Engineering for Suno

Take your Suno AI skills to the next level with advanced prompting techniques.

## Structure Your Prompts

1. **Genre/Style**: Be specific about the musical style
2. **Mood/Energy**: Describe the emotional feel
3. **Instruments**: Specify key instruments
4. **Tempo**: Indicate speed (fast, slow, moderate)
5. **Vocals**: Describe vocal style if needed

## Examples

### Electronic Music
"Deep house track with synthesized bassline, ethereal female vocals, 120 BPM, dreamy atmosphere"

### Rock Music
"Heavy metal song with distorted guitars, powerful drums, aggressive male vocals, fast tempo"

## Pro Tips

- Use music theory terms when appropriate
- Reference specific artists or eras for style
- Experiment with unusual combinations`,
    category: "advanced-techniques",
    featured: true,
    created_date: "2024-01-10",
    tags: ["advanced", "prompts", "techniques"]
  },
  {
    id: 3,
    title: "Genre Guide: Creating Hip-Hop Beats",
    slug: "hip-hop-beats-guide",
    excerpt: "Dive deep into creating authentic hip-hop beats and rap tracks with Suno AI.",
    content: `# Genre Guide: Creating Hip-Hop Beats

Hip-hop is one of the most popular genres on Suno AI. Here's how to nail it.

## Essential Elements

- **Strong Drum Pattern**: The backbone of any hip-hop track
- **Bassline**: Deep, rhythmic bass that complements the drums
- **Melody**: Can be samples, synths, or live instruments
- **Vocals**: Rap verses, sung hooks, or both

## Prompt Structure for Hip-Hop

"[Subgenre] hip-hop beat, [tempo], [mood], [specific elements]"

Examples:
- "Trap beat, 140 BPM, dark and moody, heavy 808s, snare rolls"
- "Boom bap hip-hop, 90 BPM, nostalgic, vinyl samples, punchy kicks"
- "Lo-fi hip-hop, 85 BPM, chill and relaxing, jazz samples, soft drums"`,
    category: "genre-prompts",
    featured: false,
    created_date: "2024-01-08",
    tags: ["hip-hop", "beats", "genre-guide"]
  }
];

// Mock data for guide sections
const mockGuideSections = [
  {
    id: 1,
    title: "Introduction to Suno AI",
    slug: "introduction",
    content: `# Welcome to Suno AI

Suno AI is a revolutionary music generation platform that transforms text descriptions into full musical compositions. Whether you're a seasoned musician or a complete beginner, Suno AI makes music creation accessible to everyone.

## What Makes Suno Special?

- **Text-to-Music**: Simply describe what you want to hear
- **High Quality**: Professional-grade audio output
- **Versatile Genres**: From classical to electronic, pop to metal
- **Fast Generation**: Get your music in seconds
- **Commercial Use**: Use generated music in your projects

## Getting Started

1. Sign up for a Suno AI account
2. Start with simple prompts
3. Experiment with different styles
4. Refine your prompting skills
5. Create amazing music!`,
    order: 1,
    category: "basics"
  },
  {
    id: 2,
    title: "Writing Effective Prompts",
    slug: "effective-prompts",
    content: `# Writing Effective Prompts

The key to great results with Suno AI lies in how you describe your musical vision. Here's how to write prompts that get the results you want.

## Prompt Structure

A good prompt typically includes:

1. **Genre/Style**: "jazz", "rock", "electronic", "classical"
2. **Mood/Emotion**: "upbeat", "melancholic", "energetic", "peaceful"
3. **Instruments**: "piano", "guitar", "drums", "strings"
4. **Tempo**: "fast", "slow", "moderate", or specific BPM
5. **Additional Details**: "male vocals", "instrumental", "vintage sound"

## Examples

### Good Prompts:
- "Upbeat folk song with acoustic guitar and harmonica, cheerful melody"
- "Dark ambient electronic track, synthesizers, slow tempo, atmospheric"
- "Energetic pop-punk song with electric guitars, fast drums, catchy chorus"

### Avoid These:
- "Make me a song" (too vague)
- "The best music ever" (subjective, unclear)
- "Song like [famous artist]" (copyright issues)`,
    order: 2,
    category: "basics"
  },
  {
    id: 3,
    title: "Understanding Music Genres",
    slug: "music-genres",
    content: `# Understanding Music Genres

Different genres have distinct characteristics. Understanding these will help you create more authentic and appealing music.

## Popular Genres on Suno

### Pop
- Catchy melodies and hooks
- Verse-chorus structure
- Modern production
- Accessible to wide audience

### Rock
- Electric guitars and drums
- Energetic and powerful
- Guitar solos and riffs
- Strong rhythm section

### Electronic
- Synthesized sounds
- Digital production techniques
- Varied sub-genres (house, techno, ambient)
- Often instrumental

### Jazz
- Complex harmonies
- Improvisation elements
- Swing or syncopated rhythms
- Traditional instruments (saxophone, piano, bass)

### Classical
- Orchestral instruments
- Complex compositions
- Rich harmonies
- Formal structures

## Mixing Genres

Don't be afraid to combine genres:
- "Jazz-fusion with electronic elements"
- "Folk-rock with orchestral strings"
- "Hip-hop with classical piano"`,
    order: 3,
    category: "advanced"
  }
];

// Mock API functions
export const BlogPost = {
  filter: async (filters = {}, sort = '-created_date', limit = null) => {
    let posts = [...mockBlogPosts];
    
    // Apply filters
    if (filters.featured !== undefined) {
      posts = posts.filter(post => post.featured === filters.featured);
    }
    
    if (filters.category && filters.category !== 'all') {
      posts = posts.filter(post => post.category === filters.category);
    }
    
    // Apply sorting
    if (sort === '-created_date') {
      posts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sort === 'created_date') {
      posts.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    }
    
    // Apply limit
    if (limit) {
      posts = posts.slice(0, limit);
    }
    
    return posts;
  },
  
  list: async (sort = '-created_date') => {
    return BlogPost.filter({}, sort);
  },
  
  get: async (id) => {
    return mockBlogPosts.find(post => post.id === id);
  }
};

export const GuideSection = {
  list: async (sort = 'order') => {
    let sections = [...mockGuideSections];
    
    if (sort === 'order') {
      sections.sort((a, b) => a.order - b.order);
    }
    
    return sections;
  },
  
  get: async (id) => {
    return mockGuideSections.find(section => section.id === id);
  }
};

// Mock auth (not needed for static site)
export const User = {
  getCurrentUser: async () => null,
  login: async () => null,
  logout: async () => null
};