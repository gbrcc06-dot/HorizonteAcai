import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
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
import type { Product, ProductSize } from "@shared/schema";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string | null, toppings: string[], quantity: number, price: number) => void;
}

const FREE_TOPPINGS = [
  "Leite condensado",
  "Leite em pó",
  "Granola",
  "Banana",
  "Morango",
];

const PAID_TOPPINGS = [
  "Nutella",
  "Paçoca",
  "Amendoim",
  "Kiwi",
  "Manga",
  "Uva",
  "Abacaxi",
  "Coco ralado",
  "Chocolate granulado",
  "Confete",
  "M&M's",
  "Bis",
  "Oreo",
  "Prestígio",
  "Bombom",
  "Brownie",
  "Marshmallow",
  "Chantilly",
];

const DEFAULT_SIZES: ProductSize[] = [
  { label: "200ml", value: "200ml", price: 11 },
  { label: "300ml", value: "300ml", price: 14 },
  { label: "400ml", value: "400ml", price: 17 },
  { label: "500ml", value: "500ml", price: 20 },
  { label: "700ml", value: "700ml", price: 25 },
];

export function ProductModal({ product, open, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFreeToppings, setSelectedFreeToppings] = useState<string[]>([]);
  const [selectedPaidToppings, setSelectedPaidToppings] = useState<string[]>([]);
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
  
  const currentPrice = hasSizes && selectedSize 
    ? availableSizes.find(s => s.value === selectedSize)?.price || product.basePrice
    : product.basePrice;
  
  // Calcular custo adicional de complementos
  const extraFreeToppings = Math.max(0, selectedFreeToppings.length - 5);
  const extraFreeToppingsCost = extraFreeToppings * 2;
  const paidToppingsCost = selectedPaidToppings.length * 2;
  const toppingsCost = extraFreeToppingsCost + paidToppingsCost;
  
  const totalPrice = (currentPrice + toppingsCost) * quantity;

  const handleAddToCart = () => {
    const allToppings = [...selectedFreeToppings, ...selectedPaidToppings];
    const finalPrice = currentPrice + toppingsCost;
    onAddToCart(product, selectedSize, allToppings, quantity, finalPrice);
    handleClose();
  };

  const handleClose = () => {
    setSelectedSize(null);
    setSelectedFreeToppings([]);
    setSelectedPaidToppings([]);
    setQuantity(1);
    onClose();
  };

  const toggleFreeTopping = (topping: string) => {
    setSelectedFreeToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  const togglePaidTopping = (topping: string) => {
    setSelectedPaidToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
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

          <div>
            <h3 className="mb-1 font-semibold text-lg">Acompanhamentos GRÁTIS</h3>
            <p className="text-sm text-white/70 mb-4">
              Escolha até 5 itens • Acima disso: R$ 2,00 cada
            </p>
            {selectedFreeToppings.length > 5 && (
              <Badge className="mb-3 bg-accent/90">
                +{extraFreeToppings} item(s) adicionais: R$ {extraFreeToppingsCost.toFixed(2)}
              </Badge>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FREE_TOPPINGS.map((topping) => (
                <div
                  key={topping}
                  className="flex items-center space-x-2 rounded-md border border-border p-3 hover-elevate cursor-pointer"
                  onClick={() => toggleFreeTopping(topping)}
                  data-testid={`checkbox-topping-free-${topping.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Checkbox
                    id={topping}
                    checked={selectedFreeToppings.includes(topping)}
                    onCheckedChange={() => toggleFreeTopping(topping)}
                  />
                  <Label
                    htmlFor={topping}
                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    {topping}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-lg flex items-center gap-2">
              Acompanhamentos PAGOS
              <Badge variant="secondary" className="shimmer text-white bg-accent/80">
                R$ 2,00 cada
              </Badge>
            </h3>
            {selectedPaidToppings.length > 0 && (
              <Badge className="mb-3 bg-accent/90">
                {selectedPaidToppings.length} item(s): R$ {paidToppingsCost.toFixed(2)}
              </Badge>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PAID_TOPPINGS.map((topping) => (
                <div
                  key={topping}
                  className="flex items-center space-x-2 rounded-md border border-accent/30 bg-accent/5 p-3 hover-elevate cursor-pointer"
                  onClick={() => togglePaidTopping(topping)}
                  data-testid={`checkbox-topping-paid-${topping.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Checkbox
                    id={`paid-${topping}`}
                    checked={selectedPaidToppings.includes(topping)}
                    onCheckedChange={() => togglePaidTopping(topping)}
                  />
                  <Label
                    htmlFor={`paid-${topping}`}
                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    {topping}
                  </Label>
                </div>
              ))}
            </div>
          </div>

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
