import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormElement } from "@/services/types/scanner.types";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, CheckCircle, Timer } from "lucide-react";
import { FormAlerts } from "./FormAlerts";
import { FormMonitoringSettings } from "./FormMonitoringSettings";

interface FormMonitoringDashboardProps {
  form: FormElement;
}

interface ConversionData {
  timestamp: string;
  isSuccessful: boolean;
  errorMessage?: string;
}

interface DatabaseConversion {
  conversion_timestamp: string;
  is_successful: boolean;
  error_message?: string;
  form_id: string;
  id: string;
}

interface MonitoringSettings {
  conversion_threshold: number;
  error_rate_threshold: number;
  inactivity_threshold: string;
}

export const FormMonitoringDashboard = ({ form }: FormMonitoringDashboardProps) => {
  const [conversions, setConversions] = useState<ConversionData[]>([]);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [settings, setSettings] = useState<MonitoringSettings>({
    conversion_threshold: 20.0,
    error_rate_threshold: 10.0,
    inactivity_threshold: '1 hour'
  });

  const mapDatabaseToConversionData = (data: DatabaseConversion): ConversionData => ({
    timestamp: data.conversion_timestamp,
    isSuccessful: data.is_successful,
    errorMessage: data.error_message
  });

  const checkForAnomalies = async (newData: ConversionData[], formId: string) => {
    if (newData.length < 10) return;

    const recentConversions = newData.slice(0, 5);
    const previousConversions = newData.slice(5, 10);

    const recentRate = recentConversions.filter(c => c.isSuccessful).length / recentConversions.length;
    const previousRate = previousConversions.filter(c => c.isSuccessful).length / previousConversions.length;
    const percentageChange = ((recentRate - previousRate) / previousRate) * 100;

    const recentErrorRate = recentConversions.filter(c => !c.isSuccessful).length / recentConversions.length * 100;

    const lastConversionTime = new Date(newData[0].timestamp);
    const now = new Date();
    const inactivityHours = (now.getTime() - lastConversionTime.getTime()) / (1000 * 60 * 60);

    const alerts = [];

    if (Math.abs(percentageChange) >= settings.conversion_threshold) {
      alerts.push({
        form_id: formId,
        alert_type: percentageChange > 0 ? 'conversion_increase' : 'conversion_decrease',
        message: `Conversion Rate hat sich um ${Math.abs(percentageChange).toFixed(1)}% ${percentageChange > 0 ? 'verbessert' : 'verschlechtert'}`,
        metadata: {
          previous_rate: previousRate,
          current_rate: recentRate,
          percentage_change: percentageChange
        }
      });
    }

    if (recentErrorRate >= settings.error_rate_threshold) {
      alerts.push({
        form_id: formId,
        alert_type: 'high_error_rate',
        message: `Hohe Fehlerrate: ${recentErrorRate.toFixed(1)}% der letzten Submissions waren nicht erfolgreich`,
        metadata: {
          error_rate: recentErrorRate,
          threshold: settings.error_rate_threshold
        }
      });
    }

    const inactivityThresholdHours = parseInt(settings.inactivity_threshold);
    if (inactivityHours >= inactivityThresholdHours) {
      alerts.push({
        form_id: formId,
        alert_type: 'inactivity',
        message: `Keine Formular-Submissions seit ${Math.floor(inactivityHours)} Stunden`,
        metadata: {
          last_conversion: lastConversionTime,
          hours_inactive: inactivityHours
        }
      });
    }

    if (alerts.length > 0) {
      await supabase
        .from('form_alerts')
        .insert(alerts);
    }
  };

  useEffect(() => {
    const loadConversions = async () => {
      const { data, error } = await supabase
        .from('form_conversions')
        .select('*')
        .eq('form_id', form.id)
        .order('conversion_timestamp', { ascending: false })
        .limit(100);

      if (!error && data) {
        const mappedData = data.map(mapDatabaseToConversionData);
        setConversions(mappedData);
        await checkForAnomalies(mappedData, form.id);
      }
    };

    loadConversions();

    const channel = supabase.channel('form-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'form_conversions',
          filter: `form_id=eq.${form.id}`
        },
        async (payload) => {
          const newConversion = mapDatabaseToConversionData(payload.new as DatabaseConversion);
          const updatedConversions = [newConversion, ...conversions].slice(0, 100);
          setConversions(updatedConversions);
          setRealtimeEnabled(true);
          await checkForAnomalies(updatedConversions, form.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [form.id, conversions]);

  const totalConversions = conversions.length;
  const successfulConversions = conversions.filter(c => c.isSuccessful).length;
  const conversionRate = totalConversions > 0 
    ? ((successfulConversions / totalConversions) * 100).toFixed(1)
    : "0";

  const chartData = conversions.reduce((acc: any[], conv) => {
    const date = new Date(conv.timestamp).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing.total += 1;
      if (conv.isSuccessful) existing.successful += 1;
    } else {
      acc.push({
        date,
        total: 1,
        successful: conv.isSuccessful ? 1 : 0
      });
    }
    
    return acc;
  }, []).reverse();

  return (
    <div className="space-y-6">
      <FormAlerts formId={form.id} />
      <FormMonitoringSettings 
        formId={form.id}
        onSettingsUpdate={setSettings}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Erfolgreiche Submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Submissions Total
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              Letzte 100 Einreichungen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Echtzeit-Status
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={realtimeEnabled ? "success" : "secondary"}>
                {realtimeEnabled ? "Aktiv" : "Verbinde..."}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Echtzeit-Updates
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#94a3b8" 
                  name="Gesamt" 
                />
                <Line 
                  type="monotone" 
                  dataKey="successful" 
                  stroke="#22c55e" 
                  name="Erfolgreich"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Letzte Aktivitäten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversions.slice(0, 5).map((conv, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {conv.isSuccessful ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {conv.isSuccessful ? "Erfolgreich" : "Fehler"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(conv.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
