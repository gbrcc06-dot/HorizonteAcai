import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Product, ProductSize, ToppingGroup } from "@shared/schema";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string | null, toppings: string[], quantity: number, price: number) => void;
}

const DEFAULT_SIZES: ProductSize[] = [
  { label: "200ml", value: "200ml", price: 11 },
  { label: "300ml", value: "300ml", price: 14 },
  { label: "400ml", value: "400ml", price: 17 },
  { label: "500ml", value: "500ml", price: 20 },
  { label: "700ml", value: "700ml", price: 25 },
];

export function ProductModal({ product, open, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedToppingsByGroup, setSelectedToppingsByGroup] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (!product) return null;

  const hasSizes = product.sizes && product.sizes.length > 0;
  const availableSizes = hasSizes 
    ? DEFAULT_SIZES.filter(s => product.sizes?.includes(s.value))
    : [];

  // Parsear grupos de complementos
  let toppingGroups: ToppingGroup[] = [];
  if (product.toppingGroups) {
    try {
      toppingGroups = JSON.parse(product.toppingGroups);
    } catch (e) {
      toppingGroups = [];
    }
  }

  const currentPrice = hasSizes && selectedSize 
    ? availableSizes.find(s => s.value === selectedSize)?.price || product.basePrice
    : product.basePrice;

  // Calcular custo adicional dos complementos pagos
  let toppingsCost = 0;
  Object.values(selectedToppingsByGroup).forEach(selectedItems => {
    selectedItems.forEach(itemName => {
      toppingGroups.forEach(group => {
        const item = group.items.find(i => i.name === itemName);
        if (item && item.price) {
          toppingsCost += item.price;
        }
      });
    });
  });

  const totalPrice = (currentPrice + toppingsCost) * quantity;

  const handleAddToCart = () => {
    const allToppings = Object.values(selectedToppingsByGroup).flat();
    const finalPrice = currentPrice + toppingsCost;
    onAddToCart(product, selectedSize, allToppings, quantity, finalPrice);
    handleClose();
  };

  const handleClose = () => {
    setSelectedSize(null);
    setSelectedToppingsByGroup({});
    setQuantity(1);
    onClose();
  };

  const toggleTopping = (groupId: string, toppingName: string) => {
    setSelectedToppingsByGroup(prev => {
      const groupToppings = prev[groupId] || [];
      const group = toppingGroups.find(g => g.id === groupId);
      const maxSelections = group?.maxSelections || 1;

      if (groupToppings.includes(toppingName)) {
        return {
          ...prev,
          [groupId]: groupToppings.filter(t => t !== toppingName),
        };
      } else if (groupToppings.length < maxSelections) {
        return {
          ...prev,
          [groupId]: [...groupToppings, toppingName],
        };
      }
      return prev;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-effect border-white/20 bg-background/95 text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient">
            {product.name}
          </DialogTitle>
          {product.description && (
            <DialogDescription className="text-muted-foreground">
              {product.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {hasSizes && (
            <div>
              <h3 className="mb-3 font-semibold text-lg">Escolha o tamanho</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {availableSizes.map((size) => (
                  <Button
                    key={size.value}
                    variant={selectedSize === size.value ? "default" : "outline"}
                    className={`flex flex-col h-auto py-3 ${
                      selectedSize === size.value ? "glow-effect" : ""
                    }`}
                    onClick={() => setSelectedSize(size.value)}
                    data-testid={`button-size-${size.value}`}
                  >
                    <span className="font-bold">{size.label}</span>
                    <span className="text-sm">{formatPrice(size.price)}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {toppingGroups.length > 0 && (
            <div className="border-t border-white/10 pt-4 space-y-4">
              <h3 className="font-bold text-xl">Personalize seu pedido</h3>
              
              {toppingGroups.map((group) => (
                <div key={group.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg text-white">{group.title}</h4>
                      <p className="text-xs text-white/60">{group.description}</p>
                    </div>
                    <Badge className="bg-white/10 text-white">
                      {(selectedToppingsByGroup[group.id] || []).length}/{group.maxSelections}
                    </Badge>
                  </div>

                  {group.required && (selectedToppingsByGroup[group.id] || []).length === 0 && (
                    <div className="mb-3 p-2 rounded bg-red-500/20 border border-red-500/50">
                      <p className="text-xs text-red-300">Obrigatório selecionar pelo menos 1 item</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const isSelected = (selectedToppingsByGroup[group.id] || []).includes(item.name);
                      const isDisabled = 
                        !isSelected && 
                        (selectedToppingsByGroup[group.id] || []).length >= group.maxSelections;

                      return (
                        <div
                          key={item.name}
                          className={`flex items-center justify-between rounded-md p-3 cursor-pointer border-2 transition-all ${
                            isSelected
                              ? 'border-accent bg-accent/20'
                              : isDisabled
                              ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                          onClick={() => !isDisabled && toggleTopping(group.id, item.name)}
                          data-testid={`checkbox-topping-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <Checkbox
                              id={`${group.id}-${item.name}`}
                              checked={isSelected}
                              onCheckedChange={() => !isDisabled && toggleTopping(group.id, item.name)}
                              disabled={isDisabled}
                            />
                            <Label
                              htmlFor={`${group.id}-${item.name}`}
                              className="cursor-pointer text-sm font-medium text-white leading-tight flex-1"
                            >
                              {item.name}
                            </Label>
                          </div>
                          {item.price && (
                            <span className="text-sm text-accent font-semibold ml-2">
                              +{formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="mb-3 font-semibold text-lg">Quantidade</h3>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                data-testid="button-quantity-decrease"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold w-12 text-center" data-testid="text-quantity">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                data-testid="button-quantity-increase"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold text-accent" data-testid="text-total-price">
              {formatPrice(totalPrice)}
            </p>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full sm:w-auto glow-effect-strong text-lg font-bold px-8"
            disabled={hasSizes && !selectedSize}
            data-testid="button-add-to-cart"
          >
            <Plus className="mr-2 h-5 w-5" />
            Adicionar ao carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
