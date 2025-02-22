import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import {
  ConversionData,
  MonitoringSettings,
  ChartDataPoint,
} from "./types/monitoring.types";
import { mapDatabaseToConversionData, generateChartData } from "./utils/conversion.utils";
import { analyzeConversionTrend, checkInactivity, detectErrorRateAnomaly, AnomalyAlert } from "./utils/anomaly-detection";

interface FormMonitoringDashboardProps {
  form: {
    id: string;
    name: string;
  };
}

export const FormMonitoringDashboard = ({ form }: FormMonitoringDashboardProps) => {
  const [conversions, setConversions] = useState<ConversionData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [settings, setSettings] = useState<MonitoringSettings>({
    conversion_threshold: 20,
    error_rate_threshold: 10,
    inactivity_threshold: "24",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('form_submissions')
          .select('*')
          .eq('form_id', form.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error("Error fetching initial data:", error);
          return;
        }

        if (data) {
          const mappedConversions = data.map(mapDatabaseToConversionData);
          setConversions(mappedConversions);
          setChartData(generateChartData(mappedConversions));
          checkForAnomalies(mappedConversions, form.id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [form.id]);

  useEffect(() => {
    // Setup Realtime subscription
    if (realtimeEnabled) {
      const channel = supabase
        .channel('form_submissions')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'form_submissions',
            filter: `form_id=eq.${form.id}`,
          },
          async (payload) => {
            const newConversion = mapDatabaseToConversionData(payload.new as any);
            setConversions((prev) => [newConversion, ...prev.slice(0, 99)]);
            setChartData(generateChartData([newConversion, ...conversions.slice(0, 99)]));
            checkForAnomalies([newConversion, ...conversions.slice(0, 99)], form.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [realtimeEnabled, conversions, form.id]);

  const checkForAnomalies = async (newData: ConversionData[], formId: string) => {
    if (newData.length < 10) return;

    const recentConversions = newData.slice(0, 5);
    const previousConversions = newData.slice(5, 10);
    const alerts: AnomalyAlert[] = [];

    // Analyze conversion trend
    const trendAlert = analyzeConversionTrend(
      recentConversions,
      previousConversions,
      settings.conversion_threshold
    );
    if (trendAlert) {
      trendAlert.form_id = formId;
      alerts.push(trendAlert);
    }

    // Check error rate
    const errorAlert = detectErrorRateAnomaly(
      recentConversions,
      settings.error_rate_threshold
    );
    if (errorAlert) {
      errorAlert.form_id = formId;
      alerts.push(errorAlert);
    }

    // Check inactivity
    if (newData.length > 0) {
      const inactivityAlert = checkInactivity(
        new Date(newData[0].timestamp),
        parseInt(settings.inactivity_threshold)
      );
      if (inactivityAlert) {
        inactivityAlert.form_id = formId;
        alerts.push(inactivityAlert);
      }
    }

    if (alerts.length > 0) {
      await supabase
        .from('form_alerts')
        .insert(alerts);
    }
  };

  const conversionRate =
    conversions.length > 0
      ? ((conversions.filter((c) => c.isSuccessful).length / conversions.length) * 100).toFixed(1)
      : "0.0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.name} - Monitoring Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="realtime" checked={realtimeEnabled} onCheckedChange={setRealtimeEnabled} />
            <Label htmlFor="realtime">Echtzeit-Updates aktivieren</Label>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Conversions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton height="300px" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="successful"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
