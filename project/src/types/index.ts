export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];      // Array of image URLs
  category: string;
  colors?: string[];     // Optional: available color hex codes or names
  // Do NOT include selectedColor, selectedSize, or quantity here; those belong to CartItem
}

export interface NavItem {
  name: string;
  path: string;
}