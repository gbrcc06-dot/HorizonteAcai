import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: varchar("category_id").notNull(),
  basePrice: real("base_price").notNull(),
  image: text("image"),
  isPromotion: boolean("is_promotion").default(false),
  isFeatured: boolean("is_featured").default(false),
  sizes: text("sizes").array(),
  toppings: text("toppings").array(),
  toppingGroups: text("topping_groups"), // JSON string
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  productName: text("product_name").notNull(),
  size: text("size"),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  selectedToppings: text("selected_toppings").array(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export interface ProductSize {
  label: string;
  value: string;
  price: number;
}

export interface ToppingItem {
  name: string;
  price?: number;
}

export interface ToppingGroup {
  id: string;
  title: string;
  description: string;
  maxSelections: number;
  required: boolean;
  items: ToppingItem[];
}

export interface ProductWithDetails extends Product {
  category: string;
  availableSizes?: ProductSize[];
  availableToppings?: string[];
}
