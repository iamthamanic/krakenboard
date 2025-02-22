
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Bell, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface FormAlert {
  id: string;
  form_id: string;
  alert_type: string;
  message: string;
  metadata: any;
  is_read: boolean;
  created_at: string;
}

interface FormAlertsProps {
  formId: string;
}

export const FormAlerts = ({ formId }: FormAlertsProps) => {
  const [alerts, setAlerts] = useState<FormAlert[]>([]);

  useEffect(() => {
    // Lade bestehende Alerts
    const loadAlerts = async () => {
      const { data, error } = await supabase
        .from('form_alerts')
        .select('*')
        .eq('form_id', formId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Fehler beim Laden der Alerts:', error);
        return;
      }

      if (data) {
        setAlerts(data);
      }
    };

    loadAlerts();

    // Echtzeit-Updates für neue Alerts
    const channel = supabase.channel('form-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'form_alerts',
          filter: `form_id=eq.${formId}`
        },
        (payload) => {
          const newAlert = payload.new as FormAlert;
          setAlerts(prev => [newAlert, ...prev].slice(0, 5));
          
          // Toast-Benachrichtigung für neue Alerts
          toast(newAlert.message, {
            description: `Alert Typ: ${newAlert.alert_type}`,
            action: {
              label: "Anzeigen",
              onClick: () => console.log("Alert anzeigen")
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formId]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'conversion_increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'conversion_decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'conversion_increase':
        return 'success';
      case 'conversion_decrease':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4" />
          <CardTitle>Aktuelle Alerts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
            >
              {getAlertIcon(alert.alert_type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <Badge variant={getAlertBadgeColor(alert.alert_type)}>
                    {alert.alert_type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
