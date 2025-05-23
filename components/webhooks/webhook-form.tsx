"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Webhook } from "@/lib/supabase";

interface WebhookFormProps {
  isOpen: boolean;
  onClose: () => void;
  webhook?: Webhook;
  onSuccess: () => void;
}

type FormValues = {
  name: string;
  url: string;
  event_type: string;
  is_active: boolean;
};

export function WebhookForm({ isOpen, onClose, webhook, onSuccess }: WebhookFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!webhook;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      name: webhook?.name || "",
      url: webhook?.url || "",
      event_type: webhook?.event_type || "contact.created",
      is_active: webhook?.is_active ?? true,
    }
  });

  const isActiveValue = watch("is_active");

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        throw new Error("Nicht authentifiziert");
      }

      if (isEditing) {
        const { error } = await supabase
          .from("webhooks")
          .update({
            ...data,
            user_id: user.data.user.id,
          })
          .eq("id", webhook.id);

        if (error) throw error;
        
        toast({
          title: "Webhook aktualisiert",
          description: `Der Webhook "${data.name}" wurde aktualisiert.`,
        });
      } else {
        const { error } = await supabase
          .from("webhooks")
          .insert({
            ...data,
            user_id: user.data.user.id,
          });

        if (error) throw error;
        
        toast({
          title: "Webhook erstellt",
          description: `Der Webhook "${data.name}" wurde erstellt.`,
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
          <DialogTitle>{isEditing ? "Webhook bearbeiten" : "Neuen Webhook erstellen"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Bearbeiten Sie die Webhook-Informationen und klicken Sie auf Speichern."
              : "Fügen Sie die Details des neuen Webhooks für n8n-Integration hinzu."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name ist erforderlich" })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">Webhook URL</Label>
              <Input
                id="url"
                {...register("url", { 
                  required: "URL ist erforderlich",
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message: "Bitte geben Sie eine gültige URL ein"
                  }
                })}
                placeholder="https://n8n.example.com/webhook/..."
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event_type">Event-Typ</Label>
              <Select 
                defaultValue={webhook?.event_type || "contact.created"}
                onValueChange={(value) => setValue("event_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Event-Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact.created">Kontakt erstellt</SelectItem>
                  <SelectItem value="contact.updated">Kontakt aktualisiert</SelectItem>
                  <SelectItem value="contact.deleted">Kontakt gelöscht</SelectItem>
                  <SelectItem value="interaction.created">Interaktion erstellt</SelectItem>
                  <SelectItem value="interaction.updated">Interaktion aktualisiert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={isActiveValue}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <Label htmlFor="is_active">Webhook aktiv</Label>
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
