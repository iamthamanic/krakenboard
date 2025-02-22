import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormElement } from "@/services/types/scanner.types";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, CheckCircle, Timer } from "lucide-react";

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

export const FormMonitoringDashboard = ({ form }: FormMonitoringDashboardProps) => {
  const [conversions, setConversions] = useState<ConversionData[]>([]);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

  const mapDatabaseToConversionData = (data: DatabaseConversion): ConversionData => ({
    timestamp: data.conversion_timestamp,
    isSuccessful: data.is_successful,
    errorMessage: data.error_message
  });

  useEffect(() => {
    // Lade historische Daten
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
      }
    };

    loadConversions();

    // Echtzeit-Updates einrichten
    const channel = supabase.channel('form-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'form_conversions',
          filter: `form_id=eq.${form.id}`
        },
        (payload) => {
          const newConversion = mapDatabaseToConversionData(payload.new as DatabaseConversion);
          setConversions(prev => [newConversion, ...prev].slice(0, 100));
          setRealtimeEnabled(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [form.id]);

  // Berechne KPIs
  const totalConversions = conversions.length;
  const successfulConversions = conversions.filter(c => c.isSuccessful).length;
  const conversionRate = totalConversions > 0 
    ? ((successfulConversions / totalConversions) * 100).toFixed(1)
    : "0";

  // Gruppiere Daten für Chart
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
