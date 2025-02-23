
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";
import { Shield, Key, FileWarning, History } from "lucide-react";

const Security = () => {
  const securityCards = [
    {
      title: "Zugriffskontrolle",
      description: "Verwalten Sie Benutzerrechte und Rollen",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "API-Schlüssel",
      description: "Generieren und verwalten Sie API-Schlüssel",
      icon: <Key className="h-6 w-6" />,
    },
    {
      title: "Audit-Logs",
      description: "Überprüfen Sie System- und Benutzeraktivitäten",
      icon: <History className="h-6 w-6" />,
    },
    {
      title: "Sicherheitswarnungen",
      description: "Anzeige von Sicherheitsmeldungen",
      icon: <FileWarning className="h-6 w-6" />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sicherheit</h1>
          <p className="text-muted-foreground">
            Verwalten Sie die Sicherheitseinstellungen Ihres Systems
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {securityCards.map((card, index) => (
            <Card key={index} className="p-6">
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

export default Security;
