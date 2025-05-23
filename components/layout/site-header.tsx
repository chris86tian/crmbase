"use client"; // Make this a client component

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LogIn, LogOut, Zap } from "lucide-react"; // Added Zap for logo, LogOut for logout
import { cn } from '@/lib/utils';
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import type { Session } from "@supabase/supabase-js";

export function SiteHeader() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Redirect to landing page after logout
    router.refresh(); // Optional: force refresh to clear any cached user data
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-foreground">
            CRM-BASE
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <nav className="flex items-center space-x-2">
            {session ? (
              <>
                {/* You can add more authenticated user links here, e.g., Profile */}
                {/*
                <Link
                  href="/dashboard" // Or any other authenticated route
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-foreground/80 hover:text-foreground hover:bg-accent"
                  )}
                >
                  Dashboard
                </Link>
                */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href="/auth"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-foreground/80 hover:text-foreground hover:bg-accent"
                )}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
