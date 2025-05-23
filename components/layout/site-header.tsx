import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LogIn, Zap } from "lucide-react"; // Added Zap for logo
import { cn } from '@/lib/utils';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" /> {/* Supabase-like logo icon */}
          <span className="font-bold sm:inline-block text-foreground">
            CRM-BASE
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <nav className="flex items-center space-x-2">
            {/* You can add more nav links here if needed */}
            {/* Example:
            <Link href="/pricing" className={cn(buttonVariants({ variant: "ghost" }), "text-foreground/70 hover:text-foreground")}>
              Preise
            </Link>
            */}
            <Link
              href="/auth"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }), // Changed to ghost for a more subtle look
                "text-foreground/80 hover:text-foreground hover:bg-accent"
              )}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
