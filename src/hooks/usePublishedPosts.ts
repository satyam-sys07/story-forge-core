
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";

export function usePublishedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          excerpt,
          content,
          status,
          author,
          created_at,
          categories,
          views,
          "readTime",
          user_id
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setPosts([]);
      } else {
        setPosts(
          (data || []).map((row: any) => ({
            id: row.id,
            title: row.title,
            excerpt: row.excerpt ?? "",
            content: row.content ?? "",
            status: row.status ?? "draft",
            author: row.author ?? "Unknown",
            date: row.created_at ? row.created_at.substring(0, 10) : "",
            categories: row.categories ?? [],
            views: row.views ?? 0,
            readTime: row.readTime ?? 1,
            user_id: row.user_id,
          }))
        );
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { posts, loading, error };
}
