
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
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

const CART_STORAGE_KEY = 'ssb_cart_package';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // Storage unavailable or invalid JSON
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCart(item);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(item));
    } catch {
      // Storage unavailable
    }
  };

  const clearCart = () => {
    setCart(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

