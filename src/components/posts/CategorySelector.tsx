
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  categories: { id: string; name: string }[];
  selectedCategories: string[];
  onToggle: (categoryId: string) => void;
}

export function CategorySelector({ categories, selectedCategories, onToggle }: Props) {
  return (
    <div>
      <Label className="mb-3 block">Categories</Label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategories.includes(category.id) ? "default" : "outline"}
            onClick={() => onToggle(category.id)}
            className="mb-2"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
