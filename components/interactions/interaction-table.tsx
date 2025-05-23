"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Interaction, Contact } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { InteractionForm } from "@/components/interactions/interaction-form";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CSVLink } from "react-csv";
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Download,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MessageSquare
} from "lucide-react";

export function InteractionTable() {
  const [interactions, setInteractions] = useState<(Interaction & { contact_name?: string })[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch contacts first
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("id, first_name, last_name");

      if (contactsError) throw contactsError;
      setContacts(contactsData as Contact[]);

      // Then fetch interactions
      const { data, error } = await supabase
        .from("interactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      
      // Combine interactions with contact names
      const interactionsWithNames = (data as Interaction[]).map(interaction => {
        const contact = contactsData.find(c => c.id === interaction.contact_id);
        return {
          ...interaction,
          contact_name: contact ? `${contact.first_name} ${contact.last_name}` : "Unbekannt"
        };
      });
      
      setInteractions(interactionsWithNames);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Daten",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("interactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setInteractions(interactions.filter(interaction => interaction.id !== id));
      
      toast({
        title: "Interaktion gelöscht",
        description: "Die Interaktion wurde erfolgreich gelöscht.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setIsEditOpen(true);
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

  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = 
      (interaction.contact_name && interaction.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (interaction.outcome && interaction.outcome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (interaction.notes && interaction.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter ? interaction.type === typeFilter : true;
    
    return matchesSearch && matchesType;
  });

  const csvData = filteredInteractions.map(interaction => ({
    Kontakt: interaction.contact_name,
    Typ: interaction.type,
    Datum: format(new Date(interaction.date), "dd.MM.yyyy HH:mm", { locale: de }),
    Ergebnis: interaction.outcome || "",
    Notizen: interaction.notes || "",
    Erstellt: format(new Date(interaction.created_at), "dd.MM.yyyy HH:mm", { locale: de })
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {typeFilter || "Alle Typen"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Nach Typ filtern</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                Alle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Call")}>
                Anruf
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Mail")}>
                E-Mail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Meeting")}>
                Meeting
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Follow-Up")}>
                Follow-Up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex space-x-2">
          <CSVLink 
            data={csvData} 
            filename={"interaktionen.csv"}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportieren
          </CSVLink>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Neue Interaktion
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Typ</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Ergebnis</TableHead>
              <TableHead>Notizen</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Interaktionen werden geladen...
                </TableCell>
              </TableRow>
            ) : filteredInteractions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Keine Interaktionen gefunden.
                </TableCell>
              </TableRow>
            ) : (
              filteredInteractions.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="mr-2 p-1 bg-muted rounded-full">
                        {getInteractionIcon(interaction.type)}
                      </div>
                      {interaction.type}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {interaction.contact_name}
                  </TableCell>
                  <TableCell>
                    {format(new Date(interaction.date), "dd.MM.yyyy HH:mm", { locale: de })}
                  </TableCell>
                  <TableCell>{interaction.outcome || "-"}</TableCell>
                  <TableCell>
                    {interaction.notes 
                      ? interaction.notes.length > 50 
                        ? `${interaction.notes.substring(0, 50)}...` 
                        : interaction.notes 
                      : "-"}
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
                        <DropdownMenuItem onClick={() => handleEdit(interaction)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(interaction.id)}
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
        <InteractionForm
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={fetchData}
        />
      )}

      {isEditOpen && selectedInteraction && (
        <InteractionForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          interaction={selectedInteraction}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
