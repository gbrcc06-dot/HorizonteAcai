import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { StoreHeader } from "@/components/store-header";
import { CategoryNav } from "@/components/category-nav";
import { CategorySection } from "@/components/category-section";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { StoreFooter } from "@/components/store-footer";
import { ProductSkeleton } from "@/components/product-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Product, Category, CartItem, InsertCartItem } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const { toast } = useToast();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
  });

  const addToCartMutation = useMutation({
    mutationFn: (item: InsertCartItem) => apiRequest("POST", "/api/cart", item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const groupedProducts = useMemo(() => {
    const grouped = new Map<string, Product[]>();
    
    categories.forEach(category => {
      const categoryProducts = filteredProducts.filter(
        product => product.categoryId === category.id
      );
      if (categoryProducts.length > 0) {
        grouped.set(category.id, categoryProducts);
      }
    });
    
    return grouped;
  }, [categories, filteredProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (
    product: Product,
    size: string | null,
    toppings: string[],
    quantity: number,
    price: number
  ) => {
    const cartItem: InsertCartItem = {
      productId: product.id,
      productName: product.name,
      size: size || undefined,
      price: price,
      quantity: quantity,
      selectedToppings: toppings.length > 0 ? toppings : undefined,
    };

    addToCartMutation.mutate(cartItem);
    
    toast({
      title: "Adicionado ao carrinho!",
      description: `${quantity}x ${product.name} ${size ? `(${size})` : ''}`,
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCartMutation.mutate(itemId);
    
    toast({
      title: "Item removido",
      description: "Item removido do carrinho",
    });
  };

  const handleCheckout = () => {
    const message = cartItems.map(item => {
      const toppings = item.selectedToppings && item.selectedToppings.length > 0
        ? `\nAcompanhamentos: ${item.selectedToppings.join(', ')}`
        : '';
      
      return `${item.quantity}x ${item.productName}${item.size ? ` (${item.size})` : ''}${toppings} - R$ ${(item.price * item.quantity).toFixed(2)}`;
    }).join('\n\n');
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5;
    const total = subtotal + deliveryFee;
    
    const fullMessage = `*Pedido Horizonte - Sorvete e Açaí*\n\n${message}\n\n---\nSubtotal: R$ ${subtotal.toFixed(2)}\nTaxa de entrega: R$ ${deliveryFee.toFixed(2)}\n*Total: R$ ${total.toFixed(2)}*`;
    
    const whatsappUrl = `https://wa.me/5565981041149?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 200;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <StoreHeader
        cartItemCount={cartItems.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)}
      />

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {productsLoading || categoriesLoading ? (
          <div className="space-y-12">
            {[1, 2].map((section) => (
              <div key={section}>
                <div className="mb-6 flex items-center gap-4">
                  <Skeleton className="h-10 w-48 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((item) => (
                    <ProductSkeleton key={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : groupedProducts.size === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-white/10 p-8 mb-6">
              <Search className="h-24 w-24 text-white/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Nenhum produto encontrado
            </h2>
            <p className="text-white/70">
              Tente buscar por outro termo
            </p>
          </div>
        ) : (
          Array.from(groupedProducts.entries()).map(([categoryId, categoryProducts]) => {
            const category = categories.find(c => c.id === categoryId);
            if (!category) return null;
            
            return (
              <CategorySection
                key={categoryId}
                categoryId={categoryId}
                categoryName={category.name}
                products={categoryProducts}
                onAddToCart={handleProductClick}
              />
            );
          })
        )}
      </main>

      <StoreFooter />

      <ProductModal
        product={selectedProduct}
        open={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
