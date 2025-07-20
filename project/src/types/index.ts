export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | { src: string };  // Main image
  images?: string[];  // Array of all product images
  category: string;
  tags: string[];
  sizes: string[];
  colors: Array<{
    name: string;
    hex: string;
    image?: string;  // Color-specific image
  }>;
  variants?: Array<{
    id: string;
    title: string;
    price: number;
    is_enabled: boolean;
    size?: string;
    color?: string;
  }>;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  options: Array<{
    name: string;
    type: string;
    values: Array<{
      id: number;
      title: string;
      colors?: string[];
    }>;
  }>;
  variants: Array<{
    id: string;
    sku: string;
    cost: number;
    price: number;
    title: string;
    grams: number;
    is_enabled: boolean;
    is_default: boolean;
    is_available: boolean;
    options: number[];
  }>;
  images: Array<{
    src: string;
    variant_ids: string[];
    position: string;
    is_default: boolean;
  }>;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: {
    color: string;
    size: string;
  };
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  orders: Order[];
}