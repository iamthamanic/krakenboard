
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/DataTable";
import { Users, Clock, ArrowDownUp, MousePointer } from "lucide-react";

const WebsiteTraffic = () => {
  // Beispieldaten für die Tabelle
  const pageViewsData = [
    { page: "/startseite", views: "12.4K", uniqueVisitors: "8.2K", avgTime: "2m 15s", bounceRate: "32%" },
    { page: "/produkte", views: "8.7K", uniqueVisitors: "5.9K", avgTime: "3m 45s", bounceRate: "28%" },
    { page: "/kontakt", views: "4.2K", uniqueVisitors: "3.1K", avgTime: "1m 30s", bounceRate: "45%" },
    { page: "/blog", views: "6.8K", uniqueVisitors: "4.5K", avgTime: "4m 20s", bounceRate: "25%" }
  ];

  // Tabellen-Spalten Definition
  const columns = [
    { key: "page", label: "Seite" },
    { key: "views", label: "Aufrufe" },
    { key: "uniqueVisitors", label: "Unique Visitors" },
    { key: "avgTime", label: "Durchschn. Zeit" },
    { key: "bounceRate", label: "Absprungrate" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Traffic Analytics</h1>
          <p className="text-muted-foreground">
            Detaillierte Analyse deines Website-Traffics
          </p>
        </div>

        {/* Traffic Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Besucher"
            value="24.7K"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Durchschn. Besuchszeit"
            value="2m 31s"
            icon={<Clock className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Absprungrate"
            value="42.3%"
            icon={<ArrowDownUp className="h-4 w-4" />}
            trend={{ value: 5, isPositive: false }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Seitenaufrufe"
            value="89.4K"
            icon={<MousePointer className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
            description="vs. letzter Monat"
          />
        </div>

        {/* Detailed Traffic Analytics */}
        <div className="grid gap-6">
          {/* Top Pages Table */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Top Seiten Performance</h2>
            <DataTable 
              columns={columns}
              data={pageViewsData}
            />
          </Card>

          {/* Traffic Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Traffic Quellen</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Hauptquellen deiner Website-Besucher
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Organische Suche</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Direkt</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Social Media</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Andere</span>
                  <span className="font-medium">10%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Besucherverhalten</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Wie Besucher mit deiner Website interagieren
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Desktop</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mobile</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tablet</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTraffic;
