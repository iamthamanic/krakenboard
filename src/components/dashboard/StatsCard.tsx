
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-lg border-secondary-100", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-secondary-400">{title}</CardTitle>
        <div className="text-primary-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-secondary-700">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-secondary-400 mt-1">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center",
                  trend.isPositive ? "text-primary-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}{" "}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
