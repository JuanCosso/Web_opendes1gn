// Tipos definidos manualmente para evitar dependencia de la ruta del cliente generado de Prisma

export type ProductWithImages = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  comparePrice?: number | string | null;
  sku?: string | null;
  stock: number;
  published: boolean;
  featured: boolean;
  categoryId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  images: { id?: string; url: string; alt: string | null; position?: number }[];
  category: { id: string; name: string; slug: string } | null;
  variants?: {
    id: string;
    size: string | null;
    color: string | null;
    stock: number;
    price?: number | string | null;
    sku?: string | null;
  }[];
};

export type OrderWithItems = {
  id: string;
  status: string;
  total: number | string;
  subtotal: number | string;
  createdAt?: Date;
  items: {
    quantity: number;
    price: number | string;
    product: { id: string; name: string; slug: string };
  }[];
};

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  product: ProductWithImages;
};