import { type Category, type Product, type CartItem, type InsertCartItem } from "@shared/schema";
import { categories as initialCategories, products as initialProducts } from "./data/products";
import { randomUUID } from "crypto";

export interface IStorage {
  getCategories(): Promise<Category[]>;
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
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

  async getCartItems(): Promise<CartItem[]> {
    return Array.from(this.cartItems.values());
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const cartItem: CartItem = { ...insertItem, id };
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
