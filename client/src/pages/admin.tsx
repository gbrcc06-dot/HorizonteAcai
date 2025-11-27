import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trash2, Edit2, Plus } from "lucide-react";
import { useState } from "react";
import type { Category, Product } from "@shared/schema";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  basePrice: z.number().min(0, "Preço deve ser positivo"),
  image: z.string().optional(),
  isPromotion: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sizes: z.string().optional(),
  toppings: z.string().optional(),
  toppingGroups: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function Admin() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      basePrice: 0,
      image: "",
      isPromotion: false,
      isFeatured: false,
      sizes: "",
      toppings: "",
      toppingGroups: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      return apiRequest("POST", "/api/admin/products", {
        ...data,
        basePrice: parseFloat(data.basePrice.toString()),
        sizes: data.sizes ? data.sizes.split(",").map(s => s.trim()) : undefined,
        toppings: data.toppings ? data.toppings.split(",").map(t => t.trim()) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset();
      setEditingId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (!editingId) return;
      return apiRequest("PUT", `/api/admin/products/${editingId}`, {
        ...data,
        basePrice: parseFloat(data.basePrice.toString()),
        sizes: data.sizes ? data.sizes.split(",").map(s => s.trim()) : undefined,
        toppings: data.toppings ? data.toppings.split(",").map(t => t.trim()) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/products/${id}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const groupedProducts = categories.reduce((acc, cat) => {
    acc[cat.id] = products.filter(p => p.categoryId === cat.id);
    return acc;
  }, {} as Record<string, Product[]>);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    form.reset({
      name: product.name,
      description: product.description || "",
      categoryId: product.categoryId,
      basePrice: product.basePrice,
      image: product.image || "",
      isPromotion: product.isPromotion || false,
      isFeatured: product.isFeatured || false,
      sizes: product.sizes?.join(", ") || "",
      toppings: product.toppings?.join(", ") || "",
      toppingGroups: product.toppingGroups || "",
    });
  };

  const handleSubmit = (data: ProductFormData) => {
    if (editingId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-8">Painel Administrativo</h1>

        {/* Formulário de Produtos */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? "Editar Produto" : "Adicionar Novo Produto"}
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome do Produto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Açaí 500ml"
                          {...field}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Categoria</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="glass-effect border-white/20 bg-white/10 text-white">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Descrição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descrição do produto"
                        {...field}
                        className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">URL da Imagem</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tamanhos (separados por vírgula)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pequeno, Médio, Grande"
                        {...field}
                        className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toppings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Complementos (separados por vírgula)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Granola, Mel, Leite em pó"
                        {...field}
                        className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-white/90 font-semibold"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? "Atualizar Produto" : "Adicionar Produto"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      form.reset();
                    }}
                    className="text-white border-white/20"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </Card>

        {/* Lista de Produtos por Categoria */}
        {categories.map((category) => (
          <div key={category.id} className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedProducts[category.id]?.map((product) => (
                <Card
                  key={product.id}
                  className="bg-white/10 border-white/20 backdrop-blur-md p-4 hover:bg-white/15 transition"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h4 className="text-lg font-bold text-white mb-2">{product.name}</h4>
                  {product.description && (
                    <p className="text-sm text-white/70 mb-2">{product.description}</p>
                  )}
                  <div className="text-white font-semibold mb-3">
                    R$ {product.basePrice.toFixed(2)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="flex-1 text-white border-white/20"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
