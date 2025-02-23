
import { supabase } from "@/integrations/supabase/client";

interface GA4Metrics {
  page_path: string;
  metric_name: string;
  metric_value: number;
  date_hour: string;
}

export class GoogleAnalyticsService {
  private propertyId: string;
  private accessToken: string;

  constructor(propertyId: string, accessToken: string) {
    this.propertyId = propertyId;
    this.accessToken = accessToken;
  }

  async fetchMetrics(startDate: string, endDate: string): Promise<GA4Metrics[]> {
    try {
      const response = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [
              { name: 'screenPageViews' },
              { name: 'engagementRate' },
              { name: 'averageSessionDuration' }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform GA4 response into our format
      return this.transformMetrics(data);
    } catch (error) {
      console.error('Error fetching GA4 metrics:', error);
      throw error;
    }
  }

  private transformMetrics(data: any): GA4Metrics[] {
    const metrics: GA4Metrics[] = [];
    
    data.rows?.forEach((row: any) => {
      const pagePath = row.dimensionValues[0].value;
      
      row.metricValues.forEach((metric: any, index: number) => {
        metrics.push({
          page_path: pagePath,
          metric_name: data.metricHeaders[index].name,
          metric_value: Number(metric.value),
          date_hour: new Date().toISOString() // Aktuelle Zeit als Default
        });
      });
    });

    return metrics;
  }

  async saveMetrics(metrics: GA4Metrics[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('ga4_metrics')
        .insert(metrics);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving GA4 metrics:', error);
      throw error;
    }
  }

  async syncMetrics(): Promise<void> {
    try {
      // Fetch last 30 days of data
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const metrics = await this.fetchMetrics(startDate, endDate);
      await this.saveMetrics(metrics);
    } catch (error) {
      console.error('Error syncing GA4 metrics:', error);
      throw error;
    }
  }
}
