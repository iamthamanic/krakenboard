
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
import { useSocialMediaMetrics } from "@/hooks/useSocialMediaMetrics";

const AdminPage = () => {
  const navigate = useNavigate();
  const { data: facebookMetrics } = useSocialMediaMetrics('facebook');
  const { data: instagramMetrics } = useSocialMediaMetrics('instagram');

  // Berechne die aktuellsten Metriken
  const latestFacebookMetrics = facebookMetrics?.[0];
  const latestInstagramMetrics = instagramMetrics?.[0];

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

        {/* Social Media Insights */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Facebook Follower"
            value={latestFacebookMetrics?.followers.toLocaleString() || "0"}
            icon={<BarChart3 className="h-4 w-4" />}
            description="Gesamt Follower"
          />
          <StatsCard
            title="Facebook Engagement"
            value={`${(latestFacebookMetrics?.engagement_rate || 0).toFixed(2)}%`}
            icon={<BarChart3 className="h-4 w-4" />}
            description="Durchschnittliche Engagement Rate"
          />
          <StatsCard
            title="Instagram Follower"
            value={latestInstagramMetrics?.followers.toLocaleString() || "0"}
            icon={<BarChart3 className="h-4 w-4" />}
            description="Gesamt Follower"
          />
          <StatsCard
            title="Instagram Engagement"
            value={`${(latestInstagramMetrics?.engagement_rate || 0).toFixed(2)}%`}
            icon={<BarChart3 className="h-4 w-4" />}
            description="Durchschnittliche Engagement Rate"
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
