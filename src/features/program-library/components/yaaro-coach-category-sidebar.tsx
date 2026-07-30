import { YAAROCOACH_LIBRARY_CATEGORIES } from "@/features/program-library/data/yaaro-coach-categories";
import type { YaaroCoachLibraryCategoryId } from "@/features/program-library/types/yaaro-coach-library";
import { cn } from "@/lib/utils";

export function YaaroCoachCategorySidebar({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: YaaroCoachLibraryCategoryId;
  onCategoryChange: (category: YaaroCoachLibraryCategoryId) => void;
}) {
  return (
    <div className="w-full shrink-0 sm:w-48">
      <h2 className="mb-2 px-2 text-sm font-semibold text-foreground">Categories</h2>
      <nav className="flex flex-row flex-wrap gap-0.5 sm:flex-col">
        {YAAROCOACH_LIBRARY_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            aria-current={activeCategory === category.id ? "true" : undefined}
            className={cn(
              "rounded-lg px-2 py-1.5 text-left text-sm whitespace-nowrap transition-colors",
              activeCategory === category.id
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
