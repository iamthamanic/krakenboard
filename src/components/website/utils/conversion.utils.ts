
import { ConversionData, DatabaseConversion, ChartDataPoint } from "../types/monitoring.types";

export const mapDatabaseToConversionData = (data: DatabaseConversion): ConversionData => ({
  timestamp: data.conversion_timestamp,
  isSuccessful: data.is_successful,
  errorMessage: data.error_message
});

export const generateChartData = (conversions: ConversionData[]): ChartDataPoint[] => {
  return conversions.reduce((acc: ChartDataPoint[], conv) => {
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
};
