"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die neuen Passwörter stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Passwort aktualisiert",
        description: "Ihr Passwort wurde erfolgreich aktualisiert.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Kontoeinstellungen und Präferenzen
            </p>
          </div>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Konto</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Passwort ändern</CardTitle>
                <CardDescription>
                  Aktualisieren Sie Ihr Passwort für mehr Sicherheit
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Aktuelles Passwort</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Neues Passwort</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Wird aktualisiert..." : "Passwort ändern"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API-Zugriff</CardTitle>
                <CardDescription>
                  Informationen zum API-Zugriff für n8n und andere Integrationen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Supabase REST API URL</Label>
                  <div className="flex">
                    <Input
                      readOnly
                      value={process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ""}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "");
                        toast({
                          title: "Kopiert",
                          description: "API URL wurde in die Zwischenablage kopiert.",
                        });
                      }}
                    >
                      Kopieren
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Beispiel-Endpunkte</Label>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm">
                    <p className="mb-2">GET /rest/v1/contacts</p>
                    <p className="mb-2">POST /rest/v1/interactions</p>
                    <p>DELETE /rest/v1/contacts?id=eq.123</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Authentifizierung</Label>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm">
                    <p className="mb-2">Header: apikey: {"<anon/public key>"}</p>
                    <p>Header: Authorization: Bearer {"<jwt token>"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
