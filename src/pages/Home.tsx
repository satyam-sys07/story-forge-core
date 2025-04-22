
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { usePublishedPosts } from "@/hooks/usePublishedPosts";

const Home = () => {
  const { posts, loading, error } = usePublishedPosts();

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center mb-8">
        <Link to="/" className="text-2xl font-bold text-primary">
          BlogForge
        </Link>
        <Link
          to="/"
          className="rounded px-4 py-2 bg-primary text-white font-semibold hover:bg-primary/80 transition"
        >
          Dashboard
        </Link>
      </nav>
      <h1 className="text-4xl font-bold mb-8 text-center text-primary animate-fade-in">BlogForge</h1>
      <div className="grid gap-6">
        {loading && (
          <div className="text-center text-muted-foreground">Loading latest blogs...</div>
        )}
        {error && (
          <div className="text-center text-red-500">Failed to load blogs: {error}</div>
        )}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-muted-foreground">No posts published yet.</div>
        )}
        {!loading && !error && posts.map(post => (
          <Card key={post.id} className="hover-scale transition-shadow hover:shadow-xl">
            <Link to={`/blog/${post.id}`}>
              <CardHeader>
                <CardTitle className="story-link text-2xl">{post.title}</CardTitle>
                <CardDescription>
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 flex flex-col gap-2 text-muted-foreground">
                <span><b>Author:</b> {post.author}</span>
                <span><b>Date:</b> {new Date(post.date).toLocaleDateString()}</span>
                <span><b>Read Time:</b> {post.readTime} min</span>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
