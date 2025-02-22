
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartDataPoint } from "./types/monitoring.types";

interface ConversionChartProps {
  data: ChartDataPoint[];
}

export const ConversionChart = ({ data }: ConversionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
  );
};
