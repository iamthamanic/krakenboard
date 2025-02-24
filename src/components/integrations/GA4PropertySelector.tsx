
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface GA4Property {
  propertyId: string;
  propertyName: string;
}

interface Props {
  websiteId: string;
  onPropertySelect: (selectedProperties: GA4Property[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: GA4Property[];
}

export function GA4PropertySelector({ 
  websiteId,
  onPropertySelect,
  open,
  onOpenChange,
  properties
}: Props) {
  const [selectedProperties, setSelectedProperties] = useState<GA4Property[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (selectedProperties.length === 0) {
      toast.error("Bitte wähle mindestens eine Property aus");
      return;
    }

    setIsSaving(true);
    try {
      // Speichere ausgewählte Properties in der Datenbank
      const { error } = await supabase.from('ga4_properties').insert(
        selectedProperties.map(prop => ({
          website_id: websiteId,
          property_id: prop.propertyId,
          property_name: prop.propertyName
        }))
      );

      if (error) throw error;

      toast.success("Google Analytics Properties wurden erfolgreich gespeichert");
      onPropertySelect(selectedProperties);
      onOpenChange(false);
    } catch (error) {
      console.error('Fehler beim Speichern der Properties:', error);
      toast.error("Fehler beim Speichern der Properties");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Google Analytics Properties auswählen</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.propertyId} className="flex items-center space-x-2">
                <Checkbox
                  id={property.propertyId}
                  checked={selectedProperties.some(p => p.propertyId === property.propertyId)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedProperties([...selectedProperties, property]);
                    } else {
                      setSelectedProperties(
                        selectedProperties.filter((p) => p.propertyId !== property.propertyId)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={property.propertyId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {property.propertyName}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
