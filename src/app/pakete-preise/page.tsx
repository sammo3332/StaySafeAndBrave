"use client";

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, HeartHandshake, ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { CartContext, type PricingTier } from "@/context/CartContext";
import images from "@/lib/placeholder-images.json";

const pricingTiers: PricingTier[] = [
  {
    name: "Starter Erkundung",
    id: "tier-starter",
    price: "€49",
    priceAmount: 4900,
    priceSuffix: "/ Tour",
    description: "Ideal für einen ersten Einblick und kurze Stadttouren.",
    features: [
      "2-stündige geführte Tour",
      "Ein lokaler Mentor",
      "Grundlegende Sicherheitstipps",
      "Flexible Terminwahl",
    ],
    cta: "In den Warenkorb",
    mostPopular: false,
  },
  {
    name: "Abenteuer Plus",
    id: "tier-adventure",
    price: "€99",
    priceAmount: 9900,
    priceSuffix: "/ Tour",
    description: "Für tiefere Einblicke und längere Entdeckungsreisen.",
    features: [
      "4-stündige geführte Tour",
      "Ein erfahrener Mentor",
      "Umfassende Sicherheitshinweise",
      "Individuelle Routenplanung",
      "Foto-Stopps an Hotspots",
    ],
    cta: "In den Warenkorb",
    mostPopular: true,
  },
  {
    name: "Premium Erlebnis",
    id: "tier-premium",
    price: "€189",
    priceAmount: 18900,
    priceSuffix: "/ Tour",
    description: "Das ultimative Erlebnis mit exklusiven Inhalten.",
    features: [
      "Ganztägige (8h) geführte Tour",
      "Top-Mentor mit Spezialgebiet",
      "Premium Sicherheits-Briefing",
      "Inkl. Eintrittsgelder (bis €20)",
      "Lokaler Snack/Getränk inklusive",
      "Souvenir von Stay Safe & Brave",
    ],
    cta: "In den Warenkorb",
    mostPopular: false,
  },
];

export default function PaketePreisePage() {
  const { cart, addToCart } = useContext(CartContext);

  const handleAddToCart = (tier: PricingTier) => {
    addToCart(tier);
    toast({
      title: "Paket hinzugefügt!",
      description: `"${tier.name}" wurde in deinen Warenkorb gelegt.`,
    });
  };

  return (
    <>
      <section className="w-full mb-12">
        <Image
          src={images.general.pricingHeader.src}
          alt="Plan your adventure pricing with Brave Guides"
          data-ai-hint={images.general.pricingHeader.dataAiHint}
          width={1200}
          height={400}
          className="w-full h-auto object-cover shadow-lg"
        />
      </section>
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Unsere Pakete & Preise
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Wähle das Paket, das am besten zu deinem Abenteuer in Südafrika passt. Alle Touren werden von unseren geprüften lokalen Mentoren durchgeführt, um dir ein sicheres und authentisches Erlebnis zu garantieren.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricingTiers.map((tier) => {
              const isInCart = cart?.id === tier.id;
              return (
                <Card key={tier.id} className={`flex flex-col rounded-xl shadow-lg ${tier.mostPopular ? 'border-2 border-primary relative ring-2 ring-primary' : 'border'}`}>
                  {tier.mostPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full shadow-md">
                      Beliebt
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <CardTitle className="text-2xl font-semibold text-primary">{tier.name}</CardTitle>
                    <div className="flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
                      {tier.priceSuffix && <span className="text-sm font-semibold leading-6 text-muted-foreground">{tier.priceSuffix}</span>}
                    </div>
                    <CardDescription className="mt-1 text-base leading-7 text-muted-foreground">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul role="list" className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckCircle className="h-6 w-5 flex-none text-accent" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                     <Button 
                      size="lg" 
                      className={`w-full ${tier.mostPopular ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'}`}
                      onClick={() => handleAddToCart(tier)}
                      disabled={isInCart}
                    >
                      {isInCart ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Im Warenkorb
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {tier.cta}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <HeartHandshake className="w-7 h-7" />
                Immer Inklusive: Sicherheit & lokale Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>Bei "Stay Safe and Brave" steht deine Sicherheit an erster Stelle. Jede Tour beinhaltet:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ausführliche Sicherheitseinweisung vor Tourbeginn.</li>
                <li>Begleitung durch einen geprüften, ortskundigen Mentor.</li>
                <li>Tipps zum sicheren Verhalten in der jeweiligen Umgebung.</li>
                <li>Möglichkeit, jederzeit Fragen zu stellen und Bedenken zu äußern.</li>
              </ul>
              <p>Wir möchten, dass du Südafrika unbeschwert und authentisch erleben kannst!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
