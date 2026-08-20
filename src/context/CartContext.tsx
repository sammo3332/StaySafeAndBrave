
'use client';

import React, { createContext, useState, ReactNode } from 'react';

// Typdefinition für ein Preis-Tier, die in der Preisseite wiederverwendet wird
export interface PricingTier {
  name: string;
  id: string;
  price: string;
  priceAmount: number;
  priceSuffix: string;
  description: string;
  features: string[];
  cta: string;
  mostPopular: boolean;
}

interface CartContextType {
  cart: PricingTier | null;
  addToCart: (item: PricingTier) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: null,
  addToCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<PricingTier | null>(null);

  const addToCart = (item: PricingTier) => {
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
