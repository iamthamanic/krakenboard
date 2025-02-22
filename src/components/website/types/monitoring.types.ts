
export interface ConversionData {
  timestamp: string;
  isSuccessful: boolean;
  errorMessage?: string;
}

export interface DatabaseConversion {
  conversion_timestamp: string;
  is_successful: boolean;
  error_message?: string;
  form_id: string;
  id: string;
}

export interface MonitoringSettings {
  conversion_threshold: number;
  error_rate_threshold: number;
  inactivity_threshold: string;
}

export interface ChartDataPoint {
  date: string;
  total: number;
  successful: number;
}
