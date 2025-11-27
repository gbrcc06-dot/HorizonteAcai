import { ProductCard } from "./product-card";
import type { Product } from "@shared/schema";

interface CategorySectionProps {
  categoryId: string;
  categoryName: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function CategorySection({ categoryId, categoryName, products, onAddToCart }: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section 
      id={categoryId}
      className="scroll-mt-24"
      data-testid={`section-category-${categoryId}`}
    >
      <div className="mb-6 flex items-center gap-4">
        <h2 
          className="text-3xl font-bold text-white md:text-4xl"
          data-testid={`text-category-name-${categoryId}`}
        >
          {categoryName}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
