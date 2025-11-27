import { Search, ShoppingCart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import logoUrl from "@assets/Horizonte - Sorvete-Photoroom_1764204704473.png";

interface StoreHeaderProps {
  cartItemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
}

export function StoreHeader({ cartItemCount, searchQuery, onSearchChange, onCartClick }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 justify-between" style={{ height: '160px' }}>
          <img 
            src={logoUrl} 
            alt="Horizonte - Sorvete e Açaí" 
            className="h-40 w-auto"
            data-testid="img-logo"
          />
          
          <div className="flex items-center gap-2 flex-1 ml-2">
            <div className="flex-1 flex flex-col gap-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="glass-effect border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 focus-visible:ring-accent h-8"
                  data-testid="input-search"
                />
              </div>
              <Badge 
                variant="default" 
                className="bg-green-500/90 text-white backdrop-blur-sm text-xs w-fit"
                data-testid="badge-store-status"
              >
                <div className="mr-1.5 h-2 w-2 rounded-full bg-white animate-pulse" />
                Loja Aberta • 11:00 às 22:54
              </Badge>
            </div>

            <Link href="/admin">
              <Button
                className="bg-white text-black hover:bg-white/90"
                size="icon"
                title="Painel Admin"
                data-testid="button-admin"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              onClick={onCartClick}
              className="relative glow-effect-strong"
              size="icon"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
