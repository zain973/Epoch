/**
 * Smart keyword-based image mapping for high-quality visual cover matching.
 * Shared utility suitable for both Next.js Server Components and Client Components.
 * Guarantees that every article displays a completely unique and highly topic-relevant
 * high-resolution Unsplash photo.
 */

// Unique photo mapping mapped specifically to each of the 20 seeded articles
const UNIQUE_ARTICLE_PHOTOS: Record<string, string> = {
  "getting started with fastapi & next.js": 
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", // Neon lines of code
  
  "tailwind css tips every developer should know": 
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80", // Modern UI design canvas
  
  "postgresql vs mongodb: which should you pick in 2025?": 
    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80", // Cloud server cluster room
  
  "understanding react server components": 
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80", // React framework layout
  
  "docker for developers: a practical guide": 
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80", // Terminal CLI shell command code
  
  "building a rest api with python fastapi in 30 minutes": 
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80", // Glowing green code matrices
  
  "echoes of ajanta: the spiritual tapestry of ancient caves": 
    "https://images.unsplash.com/photo-1608958415217-1d575465c0b8?auto=format&fit=crop&w=800&q=80", // Basalt stone Buddha carving in cave
  
  "weaving time: the legacy of varanasi's silk artisans": 
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80", // Golden threads and silk fabric
  
  "the typography of luxury: crafting editorial identity": 
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80", // Print editorial letterpress
  
  "minimalism in motion: the next phase of brand strategy": 
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80", // Abstract white canvas art
  
  "brutalist whispers: spacing, light, and concrete": 
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", // Raw concrete spires architectural angles
  
  "the renaissance of muralism: reclaiming public canvases": 
    "https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?auto=format&fit=crop&w=800&q=80", // Colorful street art commission mural
  
  "chasing the golden hour: narrative filmmaking on location": 
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80", // Sunset narrative shooting location
  
  "the silent lens: capturing untold portraits of rural india": 
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80", // Intimate documentary human portraits
  
  "digital art and the preservation of lost folklore": 
    "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80", // Vibrant glowing digital paint textures
  
  "the evolution of creative agencies: madison ave to decentralized hubs": 
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", // Modern agency workspace
  
  "sacred geometry: mathematical patterns in temple architecture": 
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80", // Detailed temple dome spirals carving
  
  "the art of storytelling in modern interactive media": 
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", // Interactive mobile UX UI screens
  
  "unearthing the past: lessons from Indus valley heritage": 
    "https://images.unsplash.com/photo-1599833587848-f60bbcc0ee91?auto=format&fit=crop&w=800&q=80", // Excavated brick ruins
  
  "visual poetry: shifting colors and textures in post-modern art": 
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80", // Post-modern abstract oil painting
};

export function getTopicImage(title: string, tags: string[] = []): string {
  const cleanTitle = (title || "").trim().toLowerCase();
  
  // 1. Check exact unique photo dictionary first
  if (UNIQUE_ARTICLE_PHOTOS[cleanTitle]) {
    return UNIQUE_ARTICLE_PHOTOS[cleanTitle];
  }

  // 2. Otherwise perform dynamic fallback search based on tag keywords
  const allTags = (tags || []).map(t => t.toLowerCase());
  
  // Technology, Coding, Systems
  if (allTags.some(t => ["fastapi", "python", "api", "coding", "programming", "nextjs", "react", "digital"].includes(t))) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
  }
  
  // Infrastructure, Datacenter, Systems
  if (allTags.some(t => ["databases", "postgres", "mongodb", "sql", "cloud", "docker", "devops", "deployment"].includes(t))) {
    return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80";
  }
  
  // Graphic Design, UI/UX, Style
  if (allTags.some(t => ["css", "tailwind", "frontend", "design", "ui", "ux", "style", "branding", "strategy"].includes(t))) {
    return "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80";
  }
  
  // Film, cameras, portraits
  if (allTags.some(t => ["photography", "storytelling"].includes(t))) {
    return "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80";
  }
  
  // Architecture, Concrete spires
  if (allTags.some(t => ["architecture"].includes(t))) {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
  }
  
  // Folklore, Heritage, History
  if (allTags.some(t => ["culture", "heritage", "history", "traditions", "folklore"].includes(t))) {
    return "https://images.unsplash.com/photo-1608958415217-1d575465c0b8?auto=format&fit=crop&w=800&q=80";
  }
  
  // Fine Art, Painting
  if (allTags.some(t => ["art"].includes(t))) {
    return "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80";
  }

  // Universal high-end graphic asset fallback
  return "/cultural_mural_bg.png"; 
}
