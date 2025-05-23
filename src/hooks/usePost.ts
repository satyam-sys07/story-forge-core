
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Post, PostStatus } from "@/types/post";

export function usePost(postId?: string) {
  const { user } = useAuth();
  const emptyPost: Post = {
    id: "",
    title: "",
    excerpt: "",
    content: "",
    author: user?.email || "Unknown",
    date: new Date().toISOString().split('T')[0],
    status: "draft",
    categories: [],
    views: 0,
    readTime: 3,
  };

  const [post, setPost] = useState<Post>(emptyPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!user) return;
    if (!postId) {
      setPost({ ...emptyPost, author: user.email || "Unknown" });
      return;
    }
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
      .eq("id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError || !data) {
      setError(fetchError?.message || "Post not found");
    } else {
      setPost({
        ...emptyPost,
        id: data.id,
        title: data.title,
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        status: (data.status as PostStatus) ?? "draft",
        author: data.author ?? user.email ?? "Unknown",
        date: data.created_at ? data.created_at.substring(0, 10) : "",
        categories: data.categories ?? [],
        views: data.views ?? 0,
        readTime: data.readTime ?? 1,
        user_id: data.user_id,
      });
    }
    setLoading(false);
  }, [postId, user]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  const savePost = async (values: Post, isEditing: boolean) => {
    setLoading(true);
    let error: any = null;
    let id = postId;
    const now = new Date().toISOString();
    if (isEditing && values.id) {
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          status: values.status,
          author: values.author,
          categories: values.categories,
          views: values.views,
          readTime: values.readTime,
          updated_at: now,
        })
        .eq("id", values.id)
        .eq("user_id", user?.id);
      error = updateError;
    } else {
      const { error: insertError, data } = await supabase
        .from("posts")
        .insert({
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          status: values.status,
          author: values.author,
          categories: values.categories,
          views: values.views,
          readTime: values.readTime,
          created_at: now,
          updated_at: now,
          user_id: user?.id,
        })
        .select()
        .single();
      error = insertError;
      if (data) id = data.id;
    }
    setLoading(false);
    return { error, id };
  };

  return { post, setPost, loading, error, fetchPost, savePost };
}
