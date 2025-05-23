"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Contact, Interaction } from "@/lib/supabase";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InteractionForm } from "@/components/interactions/interaction-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Phone, Mail, Calendar, MessageSquare } from "lucide-react";

interface ContactViewProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
}

export function ContactView({ isOpen, onClose, contact }: ContactViewProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInteractionFormOpen, setIsInteractionFormOpen] = useState(false);

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("interactions")
        .select("*")
        .eq("contact_id", contact.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setInteractions(data as Interaction[]);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInteractions();
    }
  }, [isOpen, contact.id]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Lead":
        return "default";
      case "Qualifiziert":
        return "secondary";
      case "Kunde":
        return "outline";
      case "Inaktiv":
        return "destructive";
      default:
        return "default";
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "Call":
        return <Phone className="h-4 w-4" />;
      case "Mail":
        return <Mail className="h-4 w-4" />;
      case "Meeting":
        return <Calendar className="h-4 w-4" />;
      case "Follow-Up":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {contact.first_name} {contact.last_name}
          </DialogTitle>
          <DialogDescription>
            <Badge variant={getStatusBadgeVariant(contact.status) as any} className="mt-2">
              {contact.status}
            </Badge>
            {contact.source && (
              <span className="ml-2 text-muted-foreground">
                Quelle: {contact.source}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">E-Mail</h3>
              <p className="mt-1">{contact.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Telefon</h3>
              <p className="mt-1">{contact.phone || "-"}</p>
            </div>
          </div>

          {contact.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notizen</h3>
              <p className="mt-1 whitespace-pre-line">{contact.notes}</p>
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Interaktionen</h3>
            <Button size="sm" onClick={() => setIsInteractionFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Interaktion
            </Button>
          </div>

          {loading ? (
            <p>Interaktionen werden geladen...</p>
          ) : interactions.length === 0 ? (
            <p className="text-muted-foreground">Keine Interaktionen vorhanden.</p>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <Card key={interaction.id}>
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-2 p-1 bg-muted rounded-full">
                          {getInteractionIcon(interaction.type)}
                        </div>
                        <CardTitle className="text-base">{interaction.type}</CardTitle>
                      </div>
                      <CardDescription>
                        {format(new Date(interaction.date), "dd.MM.yyyy HH:mm", { locale: de })}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    {interaction.outcome && (
                      <div className="mb-2">
                        <span className="font-medium">Ergebnis:</span> {interaction.outcome}
                      </div>
                    )}
                    {interaction.notes && (
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {interaction.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {isInteractionFormOpen && (
          <InteractionForm
            isOpen={isInteractionFormOpen}
            onClose={() => setIsInteractionFormOpen(false)}
            contactId={contact.id}
            onSuccess={fetchInteractions}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
