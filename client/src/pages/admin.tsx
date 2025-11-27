import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Trash2, Edit2, Plus, Home } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { Category, Product } from "@/shared/schema";

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
  const [activeCategory, setActiveCategory] = useState("promocao");

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
      categoryId: "promocao",
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
        sizes: data.sizes ? data.sizes.split(",").map(s => s.trim()).filter(s => s) : undefined,
        toppings: data.toppings ? data.toppings.split(",").map(t => t.trim()).filter(t => t) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset({ categoryId: activeCategory });
      setEditingId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (!editingId) return;
      return apiRequest("PUT", `/api/admin/products/${editingId}`, {
        ...data,
        basePrice: parseFloat(data.basePrice.toString()),
        sizes: data.sizes ? data.sizes.split(",").map(s => s.trim()).filter(s => s) : undefined,
        toppings: data.toppings ? data.toppings.split(",").map(t => t.trim()).filter(t => t) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset({ categoryId: activeCategory });
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

  const categoryProducts = products.filter(p => p.categoryId === activeCategory);

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
    <div className="min-h-screen gradient-bg p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header com botão voltar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Painel Admin</h1>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-white/90">
              <Home className="w-4 h-4 mr-2" />
              Voltar à Loja
            </Button>
          </Link>
        </div>

        {/* Formulário Rápido */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-md p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingId ? "✏️ Editar Produto" : "➕ Novo Produto"}
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome"
                          {...field}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Categoria</FormLabel>
                      <Select value={field.value} onValueChange={(value) => {
                        field.onChange(value);
                        setActiveCategory(value);
                      }}>
                        <FormControl>
                          <SelectTrigger className="glass-effect border-white/20 bg-white/10 text-white text-sm">
                            <SelectValue />
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
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Preço R$</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Imagem URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">Descrição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descrição do produto"
                        {...field}
                        className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="toppings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Complementos (separados por vírgula)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Granola, Mel, Leite em pó"
                          {...field}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Tamanhos (separados por vírgula)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Pequeno, Médio, Grande"
                          {...field}
                          className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-white/90 font-semibold flex-1"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? "Atualizar" : "Adicionar"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      form.reset({ categoryId: activeCategory });
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

        {/* Produtos por Categoria com Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 gap-1 bg-white/10 p-1">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-black text-white"
              >
                {cat.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-white/10 border-white/20 backdrop-blur-md p-4 hover:bg-white/15 transition flex flex-col"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-24 object-cover rounded-md mb-2"
                      />
                    )}
                    <h4 className="font-bold text-white text-sm mb-1">{product.name}</h4>
                    {product.description && (
                      <p className="text-xs text-white/70 mb-2 line-clamp-2">{product.description}</p>
                    )}
                    <div className="text-white font-semibold text-sm mb-3">
                      R$ {product.basePrice.toFixed(2)}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        className="flex-1 text-white border-white/20 h-8 text-xs"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(product.id)}
                        className="flex-1 h-8 text-xs"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Deletar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              {categoryProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/60">Nenhum produto nesta categoria</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
