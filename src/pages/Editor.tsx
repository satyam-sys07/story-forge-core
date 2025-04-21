
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { categories } from "@/data/mockData";
import { Check, Eye, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
import { PostStatus } from "@/types/post";
import { CategorySelector } from "@/components/posts/CategorySelector";

function EditorHeader({
  isEditing,
  postTitle,
  onGoBack,
  selectedStatus,
  onChangeStatus,
  onToggleTab,
  selectedTab,
  onSave,
  saving,
  saveEnabled,
}: {
  isEditing: boolean;
  postTitle: string;
  onGoBack: () => void;
  selectedStatus: PostStatus;
  onChangeStatus: (value: PostStatus) => void;
  onToggleTab: () => void;
  selectedTab: string;
  onSave: () => void;
  saving: boolean;
  saveEnabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onGoBack}
          title="Go back to posts"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? `Edit: ${postTitle || "Untitled Post"}` : "New Post"}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Select value={selectedStatus} onValueChange={onChangeStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={onToggleTab}
          title={selectedTab === "edit" ? "Switch to Preview" : "Switch to Edit"}
        >
          {selectedTab === "edit" ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
        <Button onClick={onSave} disabled={!saveEnabled || saving} title="Save Post">
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function EditorContent({
  post,
  onInputChange,
  onCategoryToggle,
}: {
  post: ReturnType<typeof usePost>["post"];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCategoryToggle: (categoryId: string) => void;
}) {
  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={post.title}
                onChange={onInputChange}
                placeholder="Enter post title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={post.excerpt}
                onChange={onInputChange}
                placeholder="Brief summary of your post"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={post.content}
                onChange={onInputChange}
                placeholder="Write your post content here..."
                rows={12}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <CategorySelector 
            categories={categories} 
            selectedCategories={post.categories}
            onToggle={onCategoryToggle}
          />
        </CardContent>
      </Card>
    </>
  );
}


function EditorPreview({ post }: { post: ReturnType<typeof usePost>["post"] }) {
  return (
    <Card>
      <CardContent className="prose prose-sm sm:prose-base md:prose-lg max-w-none pt-6">
        {post.title ? (
          <>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="lead">{post.excerpt}</p>}
            {post.content ? (
              <div className="mt-6">{post.content}</div>
            ) : (
              <p className="text-muted-foreground">No content yet.</p>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">Post Preview</h3>
            <p className="text-muted-foreground mt-1">
              Add a title and content to see the preview.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get('id') ?? undefined;

  const { post, setPost, loading: postLoading, error, savePost } = usePost(postId);

  const [selectedTab, setSelectedTab] = useState("edit");
  const [saving, setSaving] = useState(false);
  const isEditing = !!postId;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value: PostStatus) => {
    setPost(prev => ({
      ...prev,
      status: value,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setPost(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const wordCount = post.content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    const saveData = { ...post, readTime, author: user?.email || "Unknown" };
    const { error: saveError, id } = await savePost(saveData, isEditing);
    setSaving(false);

    if (saveError) {
      toast({
        title: "Error saving post",
        description: saveError.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: isEditing ? "Post updated" : "Post created",
        description: isEditing ? "Your post has been updated." : "Your post has been created.",
      });
      navigate('/posts');
    }
  };

  return (
    <div className="space-y-6">
      <EditorHeader
        isEditing={isEditing}
        postTitle={post.title}
        onGoBack={() => navigate('/posts')}
        selectedStatus={post.status}
        onChangeStatus={handleStatusChange}
        onToggleTab={() => setSelectedTab(selectedTab === "edit" ? "preview" : "edit")}
        selectedTab={selectedTab}
        onSave={handleSave}
        saving={saving}
        saveEnabled={!!post.title.trim()}
      />

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="hidden">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <EditorContent
            post={post}
            onInputChange={handleInputChange}
            onCategoryToggle={handleCategoryToggle}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <EditorPreview post={post} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
