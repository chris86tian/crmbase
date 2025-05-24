'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-destructive mb-4">Unerwarteter Fehler</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Entschuldigung, es ist ein unerwarteter Fehler aufgetreten.
        </p>
        <p className="text-sm text-muted-foreground mb-2">Fehlermeldung:</p>
        <pre className="mb-8 p-4 bg-muted rounded-md text-destructive-foreground overflow-x-auto">
          {error.message || 'Keine spezifische Fehlermeldung vorhanden.'}
          {error.digest && ` (Digest: ${error.digest})`}
        </pre>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          size="lg"
        >
          Erneut versuchen
        </Button>
      </div>
    </div>
  );
}
