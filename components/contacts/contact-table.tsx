"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Contact } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ContactForm } from "@/components/contacts/contact-form";
import { ContactView } from "@/components/contacts/contact-view";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CSVLink } from "react-csv";
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Download,
  Search,
  Filter
} from "lucide-react";

export function ContactTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data as Contact[]);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Kontakte",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setContacts(contacts.filter(contact => contact.id !== id));
      
      toast({
        title: "Kontakt gelöscht",
        description: "Der Kontakt wurde erfolgreich gelöscht.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditOpen(true);
  };

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewOpen(true);
  };

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

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter ? contact.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const csvData = filteredContacts.map(contact => ({
    Vorname: contact.first_name,
    Nachname: contact.last_name,
    Email: contact.email,
    Telefon: contact.phone || "",
    Status: contact.status,
    Quelle: contact.source || "",
    Notizen: contact.notes || "",
    Erstellt: format(new Date(contact.created_at), "dd.MM.yyyy HH:mm", { locale: de })
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
                {statusFilter || "Alle Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Nach Status filtern</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                Alle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Lead")}>
                Lead
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Qualifiziert")}>
                Qualifiziert
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Kunde")}>
                Kunde
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Inaktiv")}>
                Inaktiv
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex space-x-2">
          <CSVLink 
            data={csvData} 
            filename={"kontakte.csv"}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportieren
          </CSVLink>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Kontakt
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quelle</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Kontakte werden geladen...
                </TableCell>
              </TableRow>
            ) : filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Keine Kontakte gefunden.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    {contact.first_name} {contact.last_name}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(contact.status) as any}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.source || "-"}</TableCell>
                  <TableCell>
                    {format(new Date(contact.created_at), "dd.MM.yyyy", { locale: de })}
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
                        <DropdownMenuItem onClick={() => handleView(contact)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Details anzeigen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(contact)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(contact.id)}
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
        <ContactForm
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={fetchContacts}
        />
      )}

      {isEditOpen && selectedContact && (
        <ContactForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          contact={selectedContact}
          onSuccess={fetchContacts}
        />
      )}

      {isViewOpen && selectedContact && (
        <ContactView
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          contact={selectedContact}
        />
      )}
    </div>
  );
}
