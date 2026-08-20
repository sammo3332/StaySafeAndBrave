
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartContext } from '@/context/CartContext';

export function CartIcon() {
  const { cart } = useContext(CartContext);

  return (
    <Link href="/warenkorb" passHref>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {cart && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            1
          </span>
        )}
        <span className="sr-only">Warenkorb anzeigen</span>
      </Button>
    </Link>
  );
}
