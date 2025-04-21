
export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  status: PostStatus;
  categories: string[];
  views: number;
  readTime: number;
  user_id?: string; // Optionally include this for Supabase rows
}
