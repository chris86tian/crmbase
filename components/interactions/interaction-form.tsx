"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Interaction } from "@/lib/supabase";

interface InteractionFormProps {
  isOpen: boolean;
  onClose: () => void;
  contactId?: string;
  interaction?: Interaction;
  onSuccess: () => void;
}

type FormValues = {
  contact_id: string;
  type: "Call" | "Mail" | "Meeting" | "Follow-Up";
  outcome: string;
  date: string;
  notes: string;
};

export function InteractionForm({ 
  isOpen, 
  onClose, 
  contactId, 
  interaction, 
  onSuccess 
}: InteractionFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!interaction;

  // Format date for input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      contact_id: contactId || interaction?.contact_id || "",
      type: interaction?.type || "Call",
      outcome: interaction?.outcome || "",
      date: interaction ? formatDateForInput(interaction.date) : new Date().toISOString().slice(0, 16),
      notes: interaction?.notes || "",
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
          .from("interactions")
          .update({
            ...data,
            user_id: user.data.user.id,
          })
          .eq("id", interaction.id);

        if (error) throw error;
        
        toast({
          title: "Interaktion aktualisiert",
          description: `Die ${data.type}-Interaktion wurde aktualisiert.`,
        });
      } else {
        const { error } = await supabase
          .from("interactions")
          .insert({
            ...data,
            user_id: user.data.user.id,
          });

        if (error) throw error;
        
        toast({
          title: "Interaktion erstellt",
          description: `Die ${data.type}-Interaktion wurde erstellt.`,
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
          <DialogTitle>{isEditing ? "Interaktion bearbeiten" : "Neue Interaktion"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Bearbeiten Sie die Details der Interaktion und klicken Sie auf Speichern."
              : "Fügen Sie die Details der neuen Interaktion hinzu."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <input type="hidden" {...register("contact_id")} />
            
            <div className="space-y-2">
              <Label htmlFor="type">Typ</Label>
              <Select 
                defaultValue={interaction?.type || "Call"}
                onValueChange={(value) => setValue("type", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Call">Anruf</SelectItem>
                  <SelectItem value="Mail">E-Mail</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Follow-Up">Follow-Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Datum & Uhrzeit</Label>
              <Input
                id="date"
                type="datetime-local"
                {...register("date", { required: "Datum ist erforderlich" })}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outcome">Ergebnis</Label>
              <Input
                id="outcome"
                {...register("outcome")}
                placeholder="z.B. Kein Interesse, Angebot offen"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                className="min-h-[100px]"
                placeholder="Gesprächsnotizen oder weitere Informationen"
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
