
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Settings as SettingsIcon,
  BarChart3,
  Shield
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: "Benutzer",
      description: "Verwalte Benutzer und Berechtigungen",
      icon: <Users className="h-6 w-6" />,
      path: "/admin/users"
    },
    {
      title: "Einstellungen",
      description: "System- und API-Konfiguration",
      icon: <SettingsIcon className="h-6 w-6" />,
      path: "/admin/settings"
    },
    {
      title: "Dashboard",
      description: "Übersicht und Statistiken",
      icon: <BarChart3 className="h-6 w-6" />,
      path: "/admin/dashboard"
    },
    {
      title: "Sicherheit",
      description: "Zugriffskontrolle und Logs",
      icon: <Shield className="h-6 w-6" />,
      path: "/admin/security"
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

export default Admin;
