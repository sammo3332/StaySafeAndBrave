'use client';

import { useContext, useState, useEffect } from 'react';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import images from '@/lib/placeholder-images.json';

export default function BezahlenPage() {
  const { cart, clearCart } = useContext(CartContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if cart is empty, must be in useEffect to avoid state update during render
    if (!cart) {
      router.push('/pakete-preise');
    }
  }, [cart, router]);
  

  // This check is for the case where the component renders on the server first or while redirecting
  if (!cart) {
    return null; 
  }

  const handlePayment = async () => {
    setIsLoading(true);
    console.log(`Starte simulierte PayPal-Zahlung für ${cart.name}`);
    
    // Simulate a network call to Stripe/PayPal
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Zahlung erfolgreich (simuliert)",
      description: `Deine Buchung für "${cart.name}" wurde bestätigt.`,
      duration: 5000,
    });
    
    // Clear the cart and redirect to the confirmation page
    clearCart();
    router.push('/buchung-bestaetigt');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl flex items-center gap-3 justify-center">
            <CreditCard className="w-10 h-10" />
            Sichere Bezahlung
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">Schließe deine Buchung sicher ab.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Order Summary */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Bestellübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{cart.name}</span>
                <span className="font-bold text-lg">{cart.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Zwischensumme</span>
                <span>{cart.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>MwSt. (simuliert)</span>
                <span>€0.00</span>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between items-center font-bold text-xl">
                <span>Gesamtbetrag</span>
                <span className="text-primary">{cart.price}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Zahlungsmethode</CardTitle>
              <CardDescription>Schließe deine Buchung mit PayPal ab.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center">
                    <Image src={images.home.paypal.src} alt="PayPal Logo" data-ai-hint={images.home.paypal.dataAiHint} width={150} height={50} />
                  </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button size="lg" className="w-full bg-[#00457C] hover:bg-[#003057] text-white" onClick={handlePayment} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zahlung wird verarbeitet...
                  </>
                ) : (
                  'Mit PayPal bezahlen'
                )}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/warenkorb">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zum Warenkorb
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
