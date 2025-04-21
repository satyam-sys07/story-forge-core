
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PostStatus } from "@/types/post";
import React from "react";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: PostStatus | null;
  setStatusFilter: (val: PostStatus | null) => void;
}

export function PostFilters({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: Props) {
  return (
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
        <Button variant={statusFilter === null ? "default" : "outline"} onClick={() => setStatusFilter(null)} className="flex-1 sm:flex-none">All</Button>
        <Button variant={statusFilter === "published" ? "default" : "outline"} onClick={() => setStatusFilter("published")} className="flex-1 sm:flex-none">Published</Button>
        <Button variant={statusFilter === "draft" ? "default" : "outline"} onClick={() => setStatusFilter("draft")} className="flex-1 sm:flex-none">Drafts</Button>
        <Button variant={statusFilter === "archived" ? "default" : "outline"} onClick={() => setStatusFilter("archived")} className="flex-1 sm:flex-none">Archived</Button>
      </div>
    </div>
  );
}
