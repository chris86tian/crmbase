"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Webhook } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WebhookForm } from "@/components/webhooks/webhook-form";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Search,
  ExternalLink
} from "lucide-react";

export function WebhookTable() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const { toast } = useToast();

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("webhooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWebhooks(data as Webhook[]);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Webhooks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("webhooks")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
      
      toast({
        title: "Webhook gelöscht",
        description: "Der Webhook wurde erfolgreich gelöscht.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsEditOpen(true);
  };

  const handleToggleActive = async (webhook: Webhook) => {
    try {
      const { error } = await supabase
        .from("webhooks")
        .update({ is_active: !webhook.is_active })
        .eq("id", webhook.id);

      if (error) throw error;
      
      setWebhooks(webhooks.map(w => 
        w.id === webhook.id ? { ...w, is_active: !webhook.is_active } : w
      ));
      
      toast({
        title: webhook.is_active ? "Webhook deaktiviert" : "Webhook aktiviert",
        description: `Der Webhook "${webhook.name}" wurde ${webhook.is_active ? "deaktiviert" : "aktiviert"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case "contact.created":
        return "Kontakt erstellt";
      case "contact.updated":
        return "Kontakt aktualisiert";
      case "contact.deleted":
        return "Kontakt gelöscht";
      case "interaction.created":
        return "Interaktion erstellt";
      case "interaction.updated":
        return "Interaktion aktualisiert";
      default:
        return eventType;
    }
  };

  const filteredWebhooks = webhooks.filter(webhook => 
    webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webhook.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEventTypeLabel(webhook.event_type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Suchen..."
            className="w-[250px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Webhook
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Event-Typ</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Webhooks werden geladen...
                </TableCell>
              </TableRow>
            ) : filteredWebhooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Keine Webhooks gefunden.
                </TableCell>
              </TableRow>
            ) : (
              filteredWebhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">
                    {webhook.name}
                  </TableCell>
                  <TableCell>
                    {getEventTypeLabel(webhook.event_type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="truncate max-w-[200px]">{webhook.url}</span>
                      <a 
                        href={webhook.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={webhook.is_active}
                        onCheckedChange={() => handleToggleActive(webhook)}
                      />
                      <Badge variant={webhook.is_active ? "default" : "outline"}>
                        {webhook.is_active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(webhook.created_at), "dd.MM.yyyy", { locale: de })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menü öffnen</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(webhook)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(webhook.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isAddOpen && (
        <WebhookForm
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={fetchWebhooks}
        />
      )}

      {isEditOpen && selectedWebhook && (
        <WebhookForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          webhook={selectedWebhook}
          onSuccess={fetchWebhooks}
        />
      )}
    </div>
  );
}
