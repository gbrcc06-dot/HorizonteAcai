import { Plus, IceCream } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Card 
      className="group overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-accent/50 hover:shadow-xl hover:shadow-accent/20 cursor-pointer"
      onClick={() => onAddToCart(product)}
      data-testid={`card-product-${product.id}`}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              data-testid={`img-product-${product.id}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <IceCream className="h-24 w-24 text-white/30" />
            </div>
          )}
          
          {product.isPromotion && (
            <Badge 
              className="absolute right-2 top-2 bg-red-500 text-white shimmer"
              data-testid="badge-promotion"
            >
              PROMOÇÃO
            </Badge>
          )}
          
          {product.isFeatured && (
            <Badge 
              className="absolute left-2 top-2 bg-accent text-accent-foreground shimmer"
              data-testid="badge-featured"
            >
              NOVIDADE
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 
          className="mb-2 font-bold text-white text-lg line-clamp-2 group-hover:text-accent transition-colors"
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h3>
        
        {product.description && (
          <p 
            className="text-sm text-white/70 line-clamp-2 mb-3"
            data-testid={`text-product-description-${product.id}`}
          >
            {product.description}
          </p>
        )}

        <div className="flex items-baseline gap-2">
          <span 
            className="text-2xl font-bold text-accent"
            data-testid={`text-price-${product.id}`}
          >
            {formatPrice(product.basePrice)}
          </span>
          {product.sizes && product.sizes.length > 0 && (
            <span className="text-xs text-white/50">
              a partir de
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full glow-effect font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          data-testid={`button-add-${product.id}`}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}
