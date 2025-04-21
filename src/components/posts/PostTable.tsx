
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Archive, Clock } from "lucide-react";
import { Post } from "@/types/post";

interface Props {
  posts: Post[];
  onEdit: (postId: string) => void;
  onView: (postId: string) => void;
  onArchive: (postId: string) => void;
  onDelete: (postId: string) => void;
}

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

export function PostTable({ posts, onEdit, onView, onDelete, onArchive }: Props) {
  return (
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
        {posts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No posts found matching your criteria
            </TableCell>
          </TableRow>
        ) : (
          posts.map((post) => (
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
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(post.id)} title="View">
                    <Eye />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(post.id)} title="Edit">
                    <Edit />
                  </Button>
                  {post.status !== "archived" && (
                    <Button variant="ghost" size="icon" onClick={() => onArchive(post.id)} title="Archive">
                      <Archive />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => onDelete(post.id)} title="Delete">
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
