import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + product.price,
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...product, quantity: 1 }],
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + product.price,
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const productId = action.payload;
      const existingItem = state.items.find(item => item.id === productId);
      
      if (!existingItem) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== productId),
        totalItems: state.totalItems - existingItem.quantity,
        totalAmount: state.totalAmount - (existingItem.price * existingItem.quantity),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (!existingItem) return state;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
          totalItems: state.totalItems - existingItem.quantity,
          totalAmount: state.totalAmount - (existingItem.price * existingItem.quantity),
        };
      }
      
      const quantityDiff = quantity - existingItem.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + (existingItem.price * quantityDiff),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartState;
        Object.keys(cartReducer(initialState, { type: 'CLEAR_CART' })).forEach(key => {
          if (!(key in parsedCart)) {
            throw new Error(`Invalid cart data: missing ${key}`);
          }
        });
        dispatch({ type: 'CLEAR_CART' });
        parsedCart.items.forEach(item => {
          for (let i = 0; i < item.quantity; i++) {
            dispatch({ type: 'ADD_TO_CART', payload: item });
          }
        });
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}