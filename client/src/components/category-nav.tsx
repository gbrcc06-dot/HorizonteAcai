import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryNavProps {
  categories: { id: string; name: string }[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  return (
    <div className="sticky top-[180px] z-40 border-b border-white/10 glass-effect">
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => onCategoryClick(category.id)}
              className={`whitespace-nowrap ${
                activeCategory === category.id ? "glow-effect" : ""
              }`}
              data-testid={`button-category-${category.id}`}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
