import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Edit, 
  Eye, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2, 
  Archive,
  Clock
} from "lucide-react";
import { posts as initialPosts, Post } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      if (!user) return;
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        toast({
          title: "Failed to fetch posts",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setPosts(data || []);
      }
    }
    fetchPosts();
  }, [user, toast]);

  // Filter posts based on search term and status filter
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? post.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-slate-600">Draft</Badge>;
      case "archived":
        return <Badge variant="secondary" className="bg-orange-200 text-orange-700">Archived</Badge>;
      default:
        return null;
    }
  };

  const handleDelete = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "The post has been permanently deleted.",
      });
    }
  };

  const handleArchive = async (postId: string) => {
    const { error } = await supabase.from("posts").update({ status: "archived" }).eq("id", postId);
    if (error) {
      toast({
        title: "Error archiving post",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, status: "archived" } : post
      ));
      toast({
        title: "Post archived",
        description: "The post has been moved to archives.",
      });
    }
  };

  const handleEdit = (postId: string) => {
    navigate(`/editor?id=${postId}`);
  };

  const handleViewPost = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <Button className="flex items-center gap-2" onClick={() => navigate('/editor')}>
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            onClick={() => setStatusFilter(null)}
            className="flex-1 sm:flex-none"
          >
            All
          </Button>
          <Button
            variant={statusFilter === "published" ? "default" : "outline"}
            onClick={() => setStatusFilter("published")}
            className="flex-1 sm:flex-none"
          >
            Published
          </Button>
          <Button
            variant={statusFilter === "draft" ? "default" : "outline"}
            onClick={() => setStatusFilter("draft")}
            className="flex-1 sm:flex-none"
          >
            Drafts
          </Button>
          <Button
            variant={statusFilter === "archived" ? "default" : "outline"}
            onClick={() => setStatusFilter("archived")}
            className="flex-1 sm:flex-none"
          >
            Archived
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Stats</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No posts found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.date}</TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{post.readTime} min</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleViewPost(post.id)}>
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleEdit(post.id)}>
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          {post.status !== "archived" && (
                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleArchive(post.id)}>
                              <Archive className="h-4 w-4" />
                              <span>Archive</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
