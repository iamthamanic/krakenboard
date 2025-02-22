
import { ConversionData } from "../types/monitoring.types";

export interface AnomalyAlert {
  form_id: string;
  alert_type: 'conversion_increase' | 'conversion_decrease' | 'high_error_rate' | 'inactivity';
  message: string;
  metadata: Record<string, number | string>;
}

export const analyzeConversionTrend = (
  recentConversions: ConversionData[],
  previousConversions: ConversionData[],
  threshold: number
): AnomalyAlert | null => {
  if (recentConversions.length === 0 || previousConversions.length === 0) return null;

  const recentRate = recentConversions.filter(c => c.isSuccessful).length / recentConversions.length;
  const previousRate = previousConversions.filter(c => c.isSuccessful).length / previousConversions.length;
  const percentageChange = ((recentRate - previousRate) / previousRate) * 100;

  if (Math.abs(percentageChange) >= threshold) {
    return {
      form_id: '',  // Will be set by caller
      alert_type: percentageChange > 0 ? 'conversion_increase' : 'conversion_decrease',
      message: `Conversion Rate hat sich um ${Math.abs(percentageChange).toFixed(1)}% ${
        percentageChange > 0 ? 'verbessert' : 'verschlechtert'
      }`,
      metadata: {
        previous_rate: previousRate,
        current_rate: recentRate,
        percentage_change: percentageChange
      }
    };
  }

  return null;
};

export const detectErrorRateAnomaly = (
  conversions: ConversionData[],
  threshold: number
): AnomalyAlert | null => {
  if (conversions.length === 0) return null;

  const errorRate = (conversions.filter(c => !c.isSuccessful).length / conversions.length) * 100;

  if (errorRate >= threshold) {
    return {
      form_id: '', // Will be set by caller
      alert_type: 'high_error_rate',
      message: `Hohe Fehlerrate: ${errorRate.toFixed(1)}% der letzten Submissions waren nicht erfolgreich`,
      metadata: {
        error_rate: errorRate,
        threshold: threshold
      }
    };
  }

  return null;
};

export const checkInactivity = (
  lastConversion: Date,
  thresholdHours: number
): AnomalyAlert | null => {
  const now = new Date();
  const inactivityHours = (now.getTime() - lastConversion.getTime()) / (1000 * 60 * 60);

  if (inactivityHours >= thresholdHours) {
    return {
      form_id: '', // Will be set by caller
      alert_type: 'inactivity',
      message: `Keine Formular-Submissions seit ${Math.floor(inactivityHours)} Stunden`,
      metadata: {
        last_conversion: lastConversion.toISOString(), // Konvertiere Date zu String
        hours_inactive: inactivityHours
      }
    };
  }

  return null;
};
