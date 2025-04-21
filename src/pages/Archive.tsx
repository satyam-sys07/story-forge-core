
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { posts as initialPosts, Post } from "@/data/mockData";
import { Search, Calendar, Clock, RefreshCw } from "lucide-react";

export default function Archive() {
  const archivedPosts = initialPosts.filter(post => post.status === "archived");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = archivedPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Archive</h1>
      </div>

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search archived posts..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No archived posts found matching your criteria
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t flex justify-between">
                <Button variant="ghost" size="sm" className="text-primary">
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Restore
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
