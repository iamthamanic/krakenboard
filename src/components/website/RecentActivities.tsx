
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ConversionData } from "./types/monitoring.types";

interface RecentActivitiesProps {
  conversions: ConversionData[];
}

export const RecentActivities = ({ conversions }: RecentActivitiesProps) => {
  return (
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
  );
};
