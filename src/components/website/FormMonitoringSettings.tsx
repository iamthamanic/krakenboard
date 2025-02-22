
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MonitoringSettings {
  conversion_threshold: number;
  error_rate_threshold: number;
  inactivity_threshold: string;
}

interface FormMonitoringSettingsProps {
  formId: string;
  onSettingsUpdate: (settings: MonitoringSettings) => void;
}

export const FormMonitoringSettings = ({ formId, onSettingsUpdate }: FormMonitoringSettingsProps) => {
  const [settings, setSettings] = useState<MonitoringSettings>({
    conversion_threshold: 20.0,
    error_rate_threshold: 10.0,
    inactivity_threshold: '1 hour'
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('form_monitoring_settings')
        .select('*')
        .eq('form_id', formId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Fehler beim Laden der Einstellungen:', error);
        return;
      }

      if (data) {
        // Konvertiere die Daten in das erwartete Format
        const formattedSettings: MonitoringSettings = {
          conversion_threshold: data.conversion_threshold,
          error_rate_threshold: data.error_rate_threshold,
          inactivity_threshold: typeof data.inactivity_threshold === 'string' 
            ? data.inactivity_threshold 
            : '1 hour'
        };
        
        setSettings(formattedSettings);
        onSettingsUpdate(formattedSettings);
      }
    };

    loadSettings();
  }, [formId]);

  const handleSave = async () => {
    const { error } = await supabase
      .from('form_monitoring_settings')
      .upsert({
        form_id: formId,
        conversion_threshold: settings.conversion_threshold,
        error_rate_threshold: settings.error_rate_threshold,
        inactivity_threshold: settings.inactivity_threshold
      });

    if (error) {
      toast.error('Fehler beim Speichern der Einstellungen');
      return;
    }

    toast.success('Einstellungen erfolgreich gespeichert');
    onSettingsUpdate(settings);
  };

  const parseInactivityHours = (intervalStr: string): number => {
    const match = intervalStr.match(/(\d+)/);
    return match ? parseInt(match[0]) : 1;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert-Einstellungen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="conversion_threshold">
              Conversion-Änderung Schwellenwert (%)
            </Label>
            <Input
              id="conversion_threshold"
              type="number"
              value={settings.conversion_threshold}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                conversion_threshold: parseFloat(e.target.value)
              }))}
              min="1"
              max="100"
            />
          </div>

          <div>
            <Label htmlFor="error_rate_threshold">
              Fehlerrate Schwellenwert (%)
            </Label>
            <Input
              id="error_rate_threshold"
              type="number"
              value={settings.error_rate_threshold}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                error_rate_threshold: parseFloat(e.target.value)
              }))}
              min="1"
              max="100"
            />
          </div>

          <div>
            <Label htmlFor="inactivity_threshold">
              Inaktivitäts-Schwellenwert (Stunden)
            </Label>
            <Input
              id="inactivity_threshold"
              type="number"
              value={parseInactivityHours(settings.inactivity_threshold)}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                inactivity_threshold: `${e.target.value} hours`
              }))}
              min="1"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Einstellungen speichern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
