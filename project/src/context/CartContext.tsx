import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColorHex?: string;
  selectedColorName?: string;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, colorHex: string, quantity?: number, colorName?: string, price?: number) => void;
  removeItem: (productId: string, size: string, colorHex: string) => void;
  updateQuantity: (productId: string, size: string, colorHex: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure we return an array
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addItem = (product: Product, size: string, colorHex: string, quantity: number = 1, colorName?: string, price?: number) => {
    setItems(current => {
      const existingIndex = current.findIndex(
        item => item.product.id === product.id && 
                (item.selectedSize || '') === size && 
                (item.selectedColorHex || '') === colorHex
      );

      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex].quantity += quantity;
        // Always update price in case variant price changes
        if (typeof price === 'number') updated[existingIndex].price = price;
        return updated;
      }

      return [
        ...current,
        {
          product,
          quantity,
          selectedSize: size,
          selectedColorHex: colorHex,
          selectedColorName: colorName,
          price: typeof price === 'number' ? price : product.price,
        },
      ];
    });
  };

  const removeItem = (productId: string, size: string, colorHex: string) => {
    setItems(current =>
      current.filter(item =>
        !(item.product.id === productId &&
          (item.selectedSize || '') === size &&
          (item.selectedColorHex || '') === colorHex)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, colorHex: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, colorHex);
      return;
    }

    setItems(current =>
      current.map(item =>
        item.product.id === productId &&
        (item.selectedSize || '') === size &&
        (item.selectedColorHex || '') === colorHex
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate total with safety check
  const total = Array.isArray(items) 
    ? items.reduce((sum, item) => sum + ((item.price ?? item.product.price) * item.quantity), 0)
    : 0;
  
  // Calculate item count with safety check
  const itemCount = Array.isArray(items)
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}