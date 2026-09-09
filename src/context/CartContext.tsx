
'use client';

import React, { createContext, useState, ReactNode } from 'react';
import type { PackageId } from '@/lib/packages';

export interface CartItem {
  packageId: PackageId;
  packageName: string;
  mentorId?: string;
  mentorName?: string;
  priceAmount?: number;
  priceLabel?: string;
}

interface CartContextType {
  cart: CartItem | null;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: null,
  addToCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem | null>(null);

  const addToCart = (item: CartItem) => {
    setCart(item);
  };

  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

