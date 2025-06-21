import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CartItem } from '../types/cart'; // <-- Use shared CartItem type

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string; selectedColor?: string; selectedSize?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number; selectedColor?: string; selectedSize?: string } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (id: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

function isSameCartItem(a: CartItem, b: CartItem) {
  return (
    a.id === b.id &&
    a.selectedColor === b.selectedColor &&
    a.selectedSize === b.selectedSize
  );
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const item = action.payload;
      const existingItem = state.items.find(
        (i) => isSameCartItem(i, item)
      );

      if (existingItem) {
        const updatedItems = state.items.map((i) =>
          isSameCartItem(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i
        );
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + item.quantity,
          totalAmount: state.totalAmount + item.price * item.quantity,
        };
      } else {
        return {
          ...state,
          items: [...state.items, item],
          totalItems: state.totalItems + item.quantity,
          totalAmount: state.totalAmount + item.price * item.quantity,
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const { id, selectedColor, selectedSize } = action.payload;
      const existingItem = state.items.find(
        (i) =>
          i.id === id &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
      );
      if (!existingItem) return state;
      return {
        ...state,
        items: state.items.filter(
          (i) =>
            !(
              i.id === id &&
              i.selectedColor === selectedColor &&
              i.selectedSize === selectedSize
            )
        ),
        totalItems: state.totalItems - existingItem.quantity,
        totalAmount: state.totalAmount - existingItem.price * existingItem.quantity,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity, selectedColor, selectedSize } = action.payload;
      const existingItem = state.items.find(
        (i) =>
          i.id === id &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
      );
      if (!existingItem) return state;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) =>
              !(
                i.id === id &&
                i.selectedColor === selectedColor &&
                i.selectedSize === selectedSize
              )
          ),
          totalItems: state.totalItems - existingItem.quantity,
          totalAmount: state.totalAmount - existingItem.price * existingItem.quantity,
        };
      }

      const quantityDiff = quantity - existingItem.quantity;
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === id &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
            ? { ...i, quantity }
            : i
        ),
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + existingItem.price * quantityDiff,
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
        dispatch({ type: 'CLEAR_CART' });
        parsedCart.items.forEach(item => {
          dispatch({ type: 'ADD_TO_CART', payload: item });
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

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string, selectedColor?: string, selectedSize?: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, selectedColor, selectedSize } });
  };

  const updateQuantity = (id: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, selectedColor, selectedSize } });
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