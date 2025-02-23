
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Settings as SettingsIcon,
  BarChart3,
  Shield,
  Code2,
  ScrollText,
  Database
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

const AdminPage = () => {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: "Dashboard",
      description: "Übersicht und Statistiken",
      icon: <BarChart3 className="h-6 w-6" />,
      path: "/admin/dashboard"
    },
    {
      title: "Benutzer",
      description: "Verwalte Benutzer und Berechtigungen",
      icon: <Users className="h-6 w-6" />,
      path: "/admin/users"
    },
    {
      title: "System",
      description: "System- und API-Konfiguration",
      icon: <SettingsIcon className="h-6 w-6" />,
      path: "/admin/settings"
    },
    {
      title: "Sicherheit",
      description: "Zugriffskontrolle und Logs",
      icon: <Shield className="h-6 w-6" />,
      path: "/admin/security"
    },
    {
      title: "Entwicklung",
      description: "Dev & Function Logs",
      icon: <Code2 className="h-6 w-6" />,
      path: "/admin/dev"
    },
    {
      title: "Rechtliches",
      description: "Datenschutz & Nutzungsbedingungen",
      icon: <ScrollText className="h-6 w-6" />,
      path: "/admin/legal"
    },
    {
      title: "Daten & APIs",
      description: "API-Integrationen und Datenquellen",
      icon: <Database className="h-6 w-6" />,
      path: "/admin/data"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Verwalte dein KrakenBoard System
          </p>
        </div>

        {/* System Status Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Aktive Benutzer"
            value="24"
            icon={<Users className="h-4 w-4" />}
            description="Gesamt Benutzer"
          />
          <StatsCard
            title="API Auslastung"
            value="42%"
            icon={<Database className="h-4 w-4" />}
            description="Durchschnittlich"
          />
          <StatsCard
            title="System Status"
            value="99.9%"
            icon={<BarChart3 className="h-4 w-4" />}
            description="Uptime"
          />
          <StatsCard
            title="Letzte Sicherung"
            value="2h ago"
            icon={<Shield className="h-4 w-4" />}
            description="Automatisches Backup"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminCards.map((card, index) => (
            <Card 
              key={index}
              className="p-6 hover:border-primary cursor-pointer transition-colors"
              onClick={() => navigate(card.path)}
            >
              <div className="space-y-4">
                <div className="bg-secondary rounded-full p-3 w-fit">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
