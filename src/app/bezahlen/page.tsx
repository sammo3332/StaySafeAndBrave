'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CreditCard, ArrowLeft, User, Info, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function BezahlenPage() {
  const { cart } = useContext(CartContext);

  const displayPrice = cart?.priceAmount !== undefined 
    ? `${cart.priceAmount} €` 
    : (cart?.priceLabel || 'Preis in Abstimmung');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <header className="text-center py-6">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl flex items-center gap-3 justify-center">
            <CreditCard className="w-10 h-10" />
            Online-Zahlung
          </h1>
        </header>

        <div className="w-full max-w-2xl space-y-6">
          <Card className="shadow-lg border border-border/70">
            <CardHeader className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Online-Zahlung noch nicht verfügbar
                </CardTitle>
              </div>
              <CardDescription className="text-base text-muted-foreground leading-relaxed pt-2">
                Der verbindliche Buchungs- und Zahlungsprozess wird derzeit vorbereitet. Sobald Leistungen, Preise und Verfügbarkeit final abgestimmt sind, kannst du dein Paket hier sicher buchen und bezahlen.
              </CardDescription>
            </CardHeader>

            {cart && (
              <CardContent className="space-y-4 pt-2">
                <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                  <div className="text-xs uppercase tracking-wider font-semibold text-primary">
                    Ausgewähltes Begleitpaket
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <span className="text-lg font-bold text-foreground">
                      Paket {cart.packageName}
                    </span>
                    <span className="text-base font-semibold text-primary">
                      {displayPrice}
                    </span>
                  </div>

                  {(cart.mentorName || cart.mentorId) && (
                    <div className="flex items-center gap-3 p-3 rounded-md bg-background border border-border/60">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" aria-hidden="true" />
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

                  <div className="p-3 rounded-md bg-muted/60 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      Stay Safe &amp; Brave verbindet selbstbestimmte Reisende mit einem persönlichen Local Mentor. Es werden keine Tour-Aufpreise oder vorläufige Beträge berechnet.
                    </span>
                  </div>
                </div>
              </CardContent>
            )}

            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/warenkorb">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zum Warenkorb
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/pakete-preise">
                  Zu den Begleitpaketen
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

