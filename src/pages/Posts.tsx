
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePosts } from "@/hooks/usePosts";
import { PostTable } from "@/components/posts/PostTable";
import { PostFilters } from "@/components/posts/PostFilters";
import { PostStatus } from "@/types/post";

function PostsToolbar({ onNew, searchTerm, setSearchTerm, statusFilter, setStatusFilter }: {
  onNew: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: PostStatus | null;
  setStatusFilter: (val: PostStatus | null) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
      <Button className="flex items-center gap-2" onClick={onNew}>
        <Plus className="h-4 w-4" />
        <span>New Post</span>
      </Button>
    </div>
  );
}

export default function Posts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { posts, loading, error, deletePost, archivePost } = usePosts();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? post.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  const handleDelete = async (postId: string) => {
    const err = await deletePost(postId);
    if (err) {
      toast({
        title: "Error deleting post",
        description: err.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Post deleted",
        description: "The post has been permanently deleted.",
      });
    }
  };

  const handleArchive = async (postId: string) => {
    const err = await archivePost(postId);
    if (err) {
      toast({
        title: "Error archiving post",
        description: err.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Post archived",
        description: "The post has been moved to archives.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PostsToolbar 
        onNew={() => navigate('/editor')} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      <PostFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <PostTable
            posts={filteredPosts}
            onEdit={(id: string) => navigate(`/editor?id=${id}`)}
            onView={(id: string) => navigate(`/blog/${id}`)}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
