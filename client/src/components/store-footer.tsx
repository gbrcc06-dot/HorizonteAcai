import { Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function StoreFooter() {
  return (
    <footer className="border-t border-white/10 glass-effect mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contato</h3>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span>(XX) XXXXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <SiWhatsapp className="h-4 w-4 text-accent" />
                <span>(XX) XXXXX-XXXX</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-0.5" />
                <span>Rua Exemplo, 123 - Centro</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Horário de Funcionamento</h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span>Segunda a Domingo</span>
              </div>
              <p className="ml-6">11:00 às 22:54</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover-elevate"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover-elevate"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover-elevate"
                aria-label="WhatsApp"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/60">
          <p>© 2024 Horizonte - Sorvete e Açaí. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
