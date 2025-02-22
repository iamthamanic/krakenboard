
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Timer } from "lucide-react";

interface DashboardStatsProps {
  conversionRate: string;
  totalConversions: number;
  realtimeEnabled: boolean;
}

export const DashboardStats = ({ conversionRate, totalConversions, realtimeEnabled }: DashboardStatsProps) => {
  return (
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
  );
};
