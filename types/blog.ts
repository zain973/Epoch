export interface ClassicalFeedArticle {
  id: number | string;
  title: string;
  slug: string;
  content: string;
  view_count: number;
  published_at: string;
  author_name: string;
  // Fallback support if tag sets are left unmapped by classical runtimes
  tags?: string[]; 
}
