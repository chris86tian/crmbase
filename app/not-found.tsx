import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-foreground mb-6">Seite nicht gefunden</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Entschuldigung, die von Ihnen gesuchte Seite konnte nicht gefunden werden.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Zur Startseite
          </Link>
        </Button>
      </div>
    </div>
  );
}
