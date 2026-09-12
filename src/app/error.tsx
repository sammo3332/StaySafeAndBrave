'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error internally without exposing it to the UI
    console.error('App runtime error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-lg text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        Ein unerwarteter Fehler ist aufgetreten
      </h1>

      <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
        Beim Laden dieser Seite ist leider ein Problem aufgetreten. Bitte versuche es erneut oder kehre zur Startseite zurück.
      </p>

      {error?.digest && (
        <div className="mt-4 inline-block px-3 py-1 rounded bg-muted text-[11px] font-mono text-muted-foreground">
          Referenz-ID: {error.digest}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => reset()} size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Seite neu laden
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Zur Startseite
          </Link>
        </Button>
      </div>
    </div>
  );
}
