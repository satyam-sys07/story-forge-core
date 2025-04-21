
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!user) return;
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
      .eq("user_id", user.id)
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
          author: row.author ?? user.email ?? "Unknown",
          date: row.created_at ? row.created_at.substring(0, 10) : "",
          categories: row.categories ?? [],
          views: row.views ?? 0,
          readTime: row.readTime ?? 1,
          user_id: row.user_id,
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) setPosts(posts.filter(post => post.id !== postId));
    return error;
  };

  const archivePost = async (postId: string) => {
    const { error } = await supabase.from("posts").update({ status: "archived" }).eq("id", postId);
    if (!error) setPosts(posts.map(p => (p.id === postId ? { ...p, status: "archived" } : p)));
    return error;
  };

  return { posts, loading, error, fetchPosts, deletePost, archivePost };
}
