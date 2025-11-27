import { type Category, type Product, type CartItem, type InsertCartItem } from "@shared/schema";
import { categories as initialCategories, products as initialProducts } from "./data/products";
import { randomUUID } from "crypto";

export interface IStorage {
  getCategories(): Promise<Category[]>;
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  addProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;
  getCartItems(): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  removeCartItem(id: string): Promise<void>;
  clearCart(): Promise<void>;
}

export class MemStorage implements IStorage {
  private categories: Category[];
  private products: Product[];
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.categories = initialCategories;
    this.products = initialProducts;
    this.cartItems = new Map();
  }

  async getCategories(): Promise<Category[]> {
    return this.categories.sort((a, b) => a.order - b.order);
  }

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.products.filter(p => p.categoryId === categoryId);
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = { ...product, id } as Product;
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<void> {
    this.products = this.products.filter(p => p.id !== id);
  }

  async getCartItems(): Promise<CartItem[]> {
    return Array.from(this.cartItems.values());
  }

 // Linhas 69-74 corrigidas
async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
  const id = randomUUID();
  const cartItem: CartItem = { 
    ...insertItem, 
    id,
    // Coalesce (une) valores 'undefined' para valores seguros, resolvendo o erro TS2322.
    size: insertItem.size ?? null, 
    quantity: insertItem.quantity ?? 1,
    selectedToppings: insertItem.selectedToppings ?? null,
  }; 
  this.cartItems.set(id, cartItem);
  return cartItem;
}

  async removeCartItem(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(): Promise<void> {
    this.cartItems.clear();
  }
}

export const storage = new MemStorage();
