"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contact } from "@/lib/supabase";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact;
  onSuccess: () => void;
}

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: "Lead" | "Qualifiziert" | "Kunde" | "Inaktiv";
  source: string;
  notes: string;
};

export function ContactForm({ isOpen, onClose, contact, onSuccess }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!contact;

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      first_name: contact?.first_name || "",
      last_name: contact?.last_name || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      status: contact?.status || "Lead",
      source: contact?.source || "",
      notes: contact?.notes || "",
    }
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        throw new Error("Nicht authentifiziert");
      }

      if (isEditing) {
        const { error } = await supabase
          .from("contacts")
          .update({
            ...data,
            user_id: user.data.user.id,
          })
          .eq("id", contact.id);

        if (error) throw error;
        
        toast({
          title: "Kontakt aktualisiert",
          description: `${data.first_name} ${data.last_name} wurde aktualisiert.`,
        });
      } else {
        const { error } = await supabase
          .from("contacts")
          .insert({
            ...data,
            user_id: user.data.user.id,
          });

        if (error) throw error;
        
        toast({
          title: "Kontakt erstellt",
          description: `${data.first_name} ${data.last_name} wurde erstellt.`,
        });
      }

      reset();
      onSuccess();
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Kontakt bearbeiten" : "Neuen Kontakt erstellen"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Bearbeiten Sie die Informationen des Kontakts und klicken Sie auf Speichern, wenn Sie fertig sind."
              : "Fügen Sie die Details des neuen Kontakts hinzu und klicken Sie auf Erstellen."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Vorname</Label>
                <Input
                  id="first_name"
                  {...register("first_name", { required: "Vorname ist erforderlich" })}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nachname</Label>
                <Input
                  id="last_name"
                  {...register("last_name", { required: "Nachname ist erforderlich" })}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "E-Mail ist erforderlich",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Ungültige E-Mail-Adresse"
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                {...register("phone")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  defaultValue={contact?.status || "Lead"}
                  onValueChange={(value) => setValue("status", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Qualifiziert">Qualifiziert</SelectItem>
                    <SelectItem value="Kunde">Kunde</SelectItem>
                    <SelectItem value="Inaktiv">Inaktiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Quelle</Label>
                <Input
                  id="source"
                  {...register("source")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Wird gespeichert..." : isEditing ? "Speichern" : "Erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
