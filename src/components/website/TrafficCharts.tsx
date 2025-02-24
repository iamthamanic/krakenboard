
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

interface TrafficData {
  date: string;
  visitors: number;
  pageviews: number;
}

interface TrafficChartsProps {
  trafficData: TrafficData[];
  trafficSources: { name: string; value: number }[];
  deviceTypes: { name: string; value: number }[];
}

export const TrafficCharts = ({ trafficData, trafficSources, deviceTypes }: TrafficChartsProps) => {
  // Social Media Traffic aufschlüsseln
  const organicSocialMediaTraffic = [
    { name: 'Facebook Organic', value: 4 },
    { name: 'Instagram Organic', value: 2.5 },
    { name: 'LinkedIn Organic', value: 1.5 },
    { name: 'Twitter Organic', value: 1 },
    { name: 'TikTok Organic', value: 0.7 },
    { name: 'YouTube Organic', value: 0.3 }
  ];

  const paidSocialMediaTraffic = [
    { name: 'Facebook Ads', value: 4 },
    { name: 'Instagram Ads', value: 2.5 },
    { name: 'LinkedIn Ads', value: 1.5 },
    { name: 'Twitter Ads', value: 1 },
    { name: 'TikTok Ads', value: 0.8 },
    { name: 'YouTube Ads', value: 0.2 }
  ];

  // Angepasste Traffic-Quellen ohne Social Media als Einzeleintrag
  const adjustedTrafficSources = trafficSources.map(source => 
    source.name === 'Social Media' 
      ? { 
          ...source, 
          value: [...organicSocialMediaTraffic, ...paidSocialMediaTraffic]
            .reduce((acc, curr) => acc + curr.value, 0) 
        }
      : source
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Traffic Entwicklung</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#0088FE" 
                name="Besucher"
              />
              <Line 
                type="monotone" 
                dataKey="pageviews" 
                stroke="#00C49F" 
                name="Seitenaufrufe"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Traffic Quellen</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adjustedTrafficSources}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {adjustedTrafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media Traffic (Organic)</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={organicSocialMediaTraffic}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {organicSocialMediaTraffic.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media Traffic (Paid)</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paidSocialMediaTraffic}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paidSocialMediaTraffic.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Gerätetypen</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
