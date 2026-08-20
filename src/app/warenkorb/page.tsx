
'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WarenkorbPage() {
  const { cart, clearCart } = useContext(CartContext);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl flex items-center gap-3 justify-center">
            <ShoppingCart className="w-10 h-10" />
            Mein Warenkorb
          </h1>
        </header>

        {cart ? (
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Zusammenfassung deiner Buchung</CardTitle>
              <CardDescription>Bitte überprüfe die Details deines ausgewählten Pakets, bevor du zur Kasse gehst.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg bg-muted/30">
                <h3 className="text-xl font-semibold text-foreground">{cart.name}</h3>
                <p className="text-3xl font-bold text-primary mt-2">{cart.price} <span className="text-lg text-muted-foreground font-normal">{cart.priceSuffix}</span></p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {cart.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Gesamtbetrag:</p>
                <p className="text-2xl font-bold text-primary">{cart.price}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/bezahlen">
                  Zur Kasse <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Warenkorb leeren
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-lg text-center p-8 shadow-lg">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">Dein Warenkorb ist leer</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Du hast noch keine Pakete zu deinem Warenkorb hinzugefügt.
            </p>
            <Button asChild>
              <Link href="/pakete-preise">Zu den Paketen</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
