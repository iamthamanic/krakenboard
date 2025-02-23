
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Activity, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const stats = [
    {
      title: "Aktive Benutzer",
      value: "1,234",
      change: "+12%",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Seitenaufrufe",
      value: "45.2k",
      change: "+5%",
      icon: <Activity className="h-6 w-6" />,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+2%",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "Durchschn. Besuchszeit",
      value: "2m 45s",
      change: "+8%",
      icon: <BarChart3 className="h-6 w-6" />,
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Übersicht über die wichtigsten KPIs
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div className="bg-secondary rounded-full p-3 w-fit">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-2xl">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
