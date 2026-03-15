import type { Product, Category, Order, User, ProductImage, ProductVariant } from "@/app/generated/prisma";

export type ProductWithImages = Product & {
  images: ProductImage[];
  category: Category | null;
  variants?: ProductVariant[];
};

export type OrderWithItems = Order & {
  items: {
    quantity: number;
    price: number;
    product: Pick<Product, "id" | "name" | "slug">;
  }[];
};

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  product: ProductWithImages;
};