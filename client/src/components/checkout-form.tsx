import { useState } from "react";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { checkoutSchema, type CheckoutData } from "@shared/checkout-schema";

interface CheckoutFormProps {
  total: number;
  onSubmit: (data: CheckoutData) => void;
}

export function CheckoutForm({ total, onSubmit }: CheckoutFormProps) {
  const [loadingLocation, setLoadingLocation] = useState(false);

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      rua: "",
      numero: "",
      quadra: "",
      complemento: "",
      cep: "",
      paymentMethod: "pix",
      needsChange: false,
      changeAmount: total,
    },
  });

  const handleGetLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude);
          form.setValue("longitude", position.coords.longitude);
          setLoadingLocation(false);
        },
        () => {
          alert("Não conseguimos acessar sua localização");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Seu navegador não suporta geolocalização");
      setLoadingLocation(false);
    }
  };

  const paymentMethod = form.watch("paymentMethod");
  const needsChange = form.watch("needsChange");
  const changeAmount = form.watch("changeAmount");

  const changeValue =
    paymentMethod === "dinheiro" && needsChange && changeAmount
      ? changeAmount - total
      : 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-white">Endereço de Entrega</h3>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            disabled={loadingLocation}
            className="w-full"
            data-testid="button-get-location"
          >
            <MapPin className="mr-2 h-4 w-4" />
            {loadingLocation ? "Buscando localização..." : "Usar minha localização"}
          </Button>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="João Silva"
                      {...field}
                      className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                      data-testid="input-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="rua"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Rua</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rua Principal"
                        {...field}
                        className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                        data-testid="input-street"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Número</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        {...field}
                        className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                        data-testid="input-number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="quadra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Quadra</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A"
                        {...field}
                        className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                        data-testid="input-quadra"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">CEP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00000-000"
                        {...field}
                        className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                        data-testid="input-cep"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Complemento (Apto, sala, etc)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apto 42"
                      {...field}
                      className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                      data-testid="input-complement"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-6">
          <h3 className="font-bold text-lg text-white">Forma de Pagamento</h3>

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="glass-effect border-white/20 bg-white/10 text-white" data-testid="select-payment">
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-white/20">
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {paymentMethod === "dinheiro" && (
            <div className="space-y-3 rounded-lg bg-white/5 p-4 border border-white/10">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={needsChange}
                  onCheckedChange={(checked) =>
                    form.setValue("needsChange", checked as boolean)
                  }
                  data-testid="checkbox-needs-change"
                />
                <label className="text-sm text-white cursor-pointer">
                  Preciso de troco
                </label>
              </div>

              {needsChange && (
                <FormField
                  control={form.control}
                  name="changeAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Valor que será pago</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                          data-testid="input-change-amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {needsChange && changeAmount && changeAmount > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-sm text-white/80">Valor do troco:</p>
                  <p className="text-xl font-bold text-accent">
                    R$ {changeValue.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
