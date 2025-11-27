import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  quadra: z.string().optional(),
  complemento: z.string().optional(),
  cep: z.string().min(8, "CEP deve ter no mínimo 8 caracteres"),
  paymentMethod: z.enum(["pix", "cartao", "dinheiro"], {
    errorMap: () => ({ message: "Selecione uma forma de pagamento" }),
  }),
  needsChange: z.boolean().default(false),
  changeAmount: z.number().min(0).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  gpsLink: z.string().optional(),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;
