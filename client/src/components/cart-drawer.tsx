import { Trash2, ShoppingBag, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { CartItem } from "@shared/schema";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, items, onRemoveItem, onCheckout }: CartDrawerProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="glass-effect border-white/20 bg-background/95 w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-2xl font-bold text-gradient flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            Meu Carrinho
          </SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Seu carrinho está vazio" : `${items.length} ${items.length === 1 ? 'item' : 'itens'} no carrinho`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Carrinho vazio</h3>
            <p className="text-muted-foreground mb-6">
              Adicione deliciosos açaís e sorvetes ao seu carrinho!
            </p>
            <Button onClick={onClose} className="glow-effect">
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-border p-4 hover-elevate"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1" data-testid={`text-cart-item-name-${item.id}`}>
                        {item.productName}
                      </h4>
                      
                      {item.size && (
                        <Badge variant="secondary" className="mb-2" data-testid={`badge-size-${item.id}`}>
                          {item.size}
                        </Badge>
                      )}
                      
                      {item.selectedToppings && item.selectedToppings.length > 0 && (
                        <p className="text-xs text-muted-foreground mb-2">
                          <span className="font-medium">Acompanhamentos:</span>{' '}
                          {item.selectedToppings.join(', ')}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-muted-foreground">
                          Qtd: <span className="font-semibold text-foreground">{item.quantity}</span>
                        </p>
                        <Separator orientation="vertical" className="h-4" />
                        <p className="font-bold text-accent" data-testid={`text-cart-item-price-${item.id}`}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium" data-testid="text-subtotal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span className="font-medium" data-testid="text-delivery-fee">{formatPrice(deliveryFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent" data-testid="text-total">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={onCheckout}
                className="w-full glow-effect-strong text-lg font-bold py-6"
                data-testid="button-checkout"
              >
                Finalizar pedido no WhatsApp
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
