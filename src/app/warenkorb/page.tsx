
'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingCart, User, Info, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WarenkorbPage() {
  const { cart, clearCart } = useContext(CartContext);

  const displayPrice = cart?.priceAmount !== undefined 
    ? `${cart.priceAmount} €` 
    : (cart?.priceLabel || 'Preis in Abstimmung');

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
          <Card className="w-full max-w-2xl shadow-lg border border-border/70">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Ausgewähltes Begleitpaket</CardTitle>
              <CardDescription>
                Übersicht deines ausgewählten Pakets für deine Reisebegleitung mit einem persönlichen Local Mentor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-5 border rounded-lg bg-muted/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold text-foreground">
                    Paket {cart.packageName}
                  </h3>
                  <span className="text-lg font-semibold text-primary">
                    {displayPrice}
                  </span>
                </div>

                {(cart.mentorName || cart.mentorId) && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-background border border-border/60">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-semibold text-primary">
                        Ausgewählter Local Mentor
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {cart.mentorName || cart.mentorId}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-md bg-muted/60 text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Stay Safe &amp; Brave verbindet dich mit einem persönlichen Local Mentor. Die konkreten Leistungen und Preise werden derzeit final abgestimmt.
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border/60">
                <p className="text-base font-semibold text-foreground">Status / Preis:</p>
                <p className="text-xl font-bold text-primary">{displayPrice}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                disabled
                className="w-full bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed font-medium border border-border/60 shadow-none"
              >
                Buchung noch nicht verfügbar
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/bezahlen">
                    Online-Zahlung ansehen <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  <Trash2 className="w-4 h-4 mr-1.5 text-muted-foreground" />
                  Warenkorb leeren
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-lg text-center p-8 shadow-lg">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">Dein Warenkorb ist leer</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Du hast noch kein Begleitpaket zu deinem Warenkorb hinzugefügt.
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

