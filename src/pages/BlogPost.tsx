
import { useParams, Link, useNavigate } from "react-router-dom";
import { posts } from "@/data/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === id && p.status === "published");

  if (!post) {
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
