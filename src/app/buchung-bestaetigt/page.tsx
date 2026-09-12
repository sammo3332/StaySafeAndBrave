
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, PartyPopper } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Buchung eingereicht",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingConfirmationPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center">
        <Card className="w-full max-w-lg shadow-xl p-4 sm:p-8">
          <CardHeader className="items-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                <PartyPopper className="w-12 h-12" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">
                Buchungsanfrage erfolgreich!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Vielen Dank für deine Anfrage! Deine Reisebegleitung mit einem verifizierten Local Mentor wurde sicher übermittelt.
            </p>
            <div className="text-left bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <p className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0"/>
                  Deine Buchungsdetails sind in deinem persönlichen Dashboard hinterlegt.
                </p>
                <p className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0"/>
                  Du kannst den Abstimmungsstatus und Nachrichten mit deinem Mentor direkt im Portal verfolgen.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild className="w-full" size="lg">
                    <Link href="/dashboard/bookings">
                        Zu meinen Buchungen
                    </Link>
                </Button>
                 <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href="/mentors">
                        Weitere Mentoren entdecken
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
