
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, UserPlus, Mail, Shield, User } from "lucide-react";

const Users = () => {
  const mockUsers = [
    { id: 1, name: "Max Mustermann", email: "max@example.com", role: "Admin", status: "active" },
    { id: 2, name: "Anna Schmidt", email: "anna@example.com", role: "Editor", status: "active" },
    { id: 3, name: "John Doe", email: "john@example.com", role: "User", status: "inactive" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Benutzerverwaltung</h1>
            <p className="text-muted-foreground mt-2">
              Verwalte Benutzer und ihre Berechtigungen
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Benutzer hinzufügen
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Benutzer mit Admin-Rechten haben vollen Zugriff auf alle Systemfunktionen.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {mockUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-secondary rounded-full p-3">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.role}</span>
                  </div>
                  <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                    {user.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Bearbeiten
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Benutzerstatistiken</CardTitle>
            <CardDescription>
              Übersicht über Benutzeraktivitäten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground">Aktive Benutzer</h4>
                <p className="text-2xl font-bold mt-2">24</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground">Neue Benutzer (30 Tage)</h4>
                <p className="text-2xl font-bold mt-2">12</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground">Admin-Benutzer</h4>
                <p className="text-2xl font-bold mt-2">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Users;
