
import { useEffect, useState } from "react";
import { FormElement } from "@/services/types/scanner.types";
import { supabase } from "@/integrations/supabase/client";
import { FormAlerts } from "./FormAlerts";
import { FormMonitoringSettings } from "./FormMonitoringSettings";
import { DashboardStats } from "./DashboardStats";
import { ConversionChart } from "./ConversionChart";
import { RecentActivities } from "./RecentActivities";
import { ConversionData, MonitoringSettings, DatabaseConversion } from "./types/monitoring.types";
import { mapDatabaseToConversionData, generateChartData } from "./utils/conversion.utils";

interface FormMonitoringDashboardProps {
  form: FormElement;
}

export const FormMonitoringDashboard = ({ form }: FormMonitoringDashboardProps) => {
  const [conversions, setConversions] = useState<ConversionData[]>([]);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [settings, setSettings] = useState<MonitoringSettings>({
    conversion_threshold: 20.0,
    error_rate_threshold: 10.0,
    inactivity_threshold: '1 hour'
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

  const chartData = generateChartData(conversions);

  return (
    <div className="space-y-6">
      <FormAlerts formId={form.id} />
      <FormMonitoringSettings 
        formId={form.id}
        onSettingsUpdate={setSettings}
      />
      
      <DashboardStats 
        conversionRate={conversionRate}
        totalConversions={totalConversions}
        realtimeEnabled={realtimeEnabled}
      />

      <ConversionChart data={chartData} />

      <RecentActivities conversions={conversions} />
    </div>
  );
};
