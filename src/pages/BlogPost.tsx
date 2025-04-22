
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post, PostStatus } from "@/types/post";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
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
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();

      if (fetchError || !data) {
        console.error("Error fetching post:", fetchError?.message || "Post not found");
        setError(fetchError?.message || "Post not found");
        setPost(null);
      } else {
        setPost({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          status: (data.status as PostStatus) ?? "published",
          author: data.author ?? "Unknown",
          date: data.created_at ? data.created_at.substring(0, 10) : "",
          categories: data.categories ?? [],
          views: data.views ?? 0,
          readTime: data.readTime ?? 1,
          user_id: data.user_id,
        });
      }
      
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto pt-16 text-center animate-fade-in">
        <p className="mb-8 text-lg">Loading blog post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto pt-16 text-center animate-fade-in">
        <p className="mb-8 text-lg text-destructive">Blog post not found.</p>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-fade-in">
      <Link to="/home" className="flex items-center text-primary text-sm hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">{post.title}</CardTitle>
          <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground text-sm">
            <span>By <b>{post.author}</b></span>
            <span>· {new Date(post.date).toLocaleDateString()}</span>
            <span>· {post.readTime} min read</span>
          </div>
        </CardHeader>
        <CardContent className="prose max-w-none pt-6 text-base leading-relaxed">
          {post.content}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPost;
