"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Database, Users, CalendarClock, Webhook, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mr-4 flex">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <Database className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          CRM System
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/dashboard"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Kontakte</span>
          </div>
        </Link>
        <Link
          href="/interactions"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/interactions"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4" />
            <span>Interaktionen</span>
          </div>
        </Link>
        <Link
          href="/webhooks"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/webhooks"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-1">
            <Webhook className="h-4 w-4" />
            <span>Webhooks</span>
          </div>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/settings"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Einstellungen</span>
          </div>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-primary">
          <LogOut className="h-4 w-4 mr-1" />
          <span>Abmelden</span>
        </Button>
      </nav>
    </div>
  );
}
