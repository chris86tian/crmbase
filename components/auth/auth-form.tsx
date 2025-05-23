"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthForm() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Fehler bei der Registrierung",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registrierung erfolgreich",
        description: "Sie können sich jetzt anmelden.",
      });
      // Optionally, clear form or switch tabs
      setEmail("");
      setPassword("");
    }
    
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Anmeldefehler",
        description: error.message,
        variant: "destructive",
      });
    } else {
      router.push("/dashboard");
      router.refresh(); // Ensures layout re-renders if user state changes
    }
    
    setLoading(false);
  };

  if (!isClient) {
    // Render a skeleton placeholder during SSR and initial client render
    return (
      <Card className="w-full max-w-md animate-pulse">
        <CardHeader>
          <div className="h-7 bg-muted rounded w-3/4 mx-auto mb-1"></div> {/* Skeleton for CardTitle */}
          <div className="h-4 bg-muted rounded w-full mx-auto mb-3"></div> {/* Skeleton for CardDescription */}
          <div className="grid w-full grid-cols-2 mt-4 gap-2"> {/* Skeleton for TabsList */}
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6"> {/* pt-6 to mimic CardContent padding */}
          <div className="space-y-2"> {/* Skeleton for Email field */}
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
          <div className="space-y-2"> {/* Skeleton for Password field */}
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
        <CardFooter> {/* Skeleton for Button */}
          <div className="h-10 bg-muted rounded w-full"></div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <Tabs defaultValue="login">
        <CardHeader>
          <CardTitle className="text-2xl text-center">CRM System</CardTitle>
          <CardDescription className="text-center">
            Verwalten Sie Ihre Kundenkontakte einfach und effizient
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="login">Anmelden</TabsTrigger>
            <TabsTrigger value="register">Registrieren</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="login">
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">E-Mail</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Passwort</Label>
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wird angemeldet..." : "Anmelden"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-register">E-Mail</Label>
                <Input
                  id="email-register"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register">Passwort</Label>
                <Input
                  id="password-register"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wird registriert..." : "Registrieren"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
