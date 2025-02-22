
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, UserPlus, Mail, Shield, User } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "@/components/ui/use-toast";

const Users = () => {
  const { users, updateUser } = useUsers();

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    try {
      await updateUser.mutateAsync({
        id,
        is_active: !isActive
      });
      toast({
        title: "Erfolg",
        description: `Benutzerstatus wurde ${!isActive ? 'aktiviert' : 'deaktiviert'}.`,
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Benutzerstatus konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  if (users.isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-8 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card key={n}>
                <CardContent className="h-20"></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

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
          {users.data?.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-secondary rounded-full p-3">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.full_name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>{user.role}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant={user.is_active ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => handleStatusToggle(user.id, user.is_active)}
                  >
                    <Badge variant={user.is_active ? 'success' : 'warning'}>
                      {user.is_active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </Button>
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
                <p className="text-2xl font-bold mt-2">
                  {users.data?.filter(u => u.is_active).length || 0}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground">Neue Benutzer (30 Tage)</h4>
                <p className="text-2xl font-bold mt-2">
                  {users.data?.filter(u => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return new Date(u.created_at) > thirtyDaysAgo;
                  }).length || 0}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground">Admin-Benutzer</h4>
                <p className="text-2xl font-bold mt-2">
                  {users.data?.filter(u => u.role === 'admin').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Users;
