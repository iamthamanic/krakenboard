
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Settings, Users, Database, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Verwalte deine KrakenBoard-Instanz und Einstellungen
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Willkommen im Admin-Bereich. Hier kannst du alle wichtigen Einstellungen vornehmen.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
            <TabsTrigger value="data">Daten & APIs</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Instanz-Einstellungen</CardTitle>
                <CardDescription>
                  Grundlegende Einstellungen für deine KrakenBoard-Installation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/admin/settings">
                    <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Settings className="h-6 w-6" />
                        <div>
                          <h3 className="font-medium">System-Einstellungen</h3>
                          <p className="text-sm text-muted-foreground">
                            Konfiguriere Systemparameter und Defaults
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                  <Link to="/admin/users">
                    <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Users className="h-6 w-6" />
                        <div>
                          <h3 className="font-medium">Benutzerverwaltung</h3>
                          <p className="text-sm text-muted-foreground">
                            Verwalte Benutzer und Berechtigungen
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sicherheitseinstellungen</CardTitle>
                <CardDescription>
                  Konfiguriere Sicherheitsrichtlinien und Zugriffskontrollen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-6">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-6 w-6" />
                      <div className="flex-1">
                        <h3 className="font-medium">API-Sicherheit</h3>
                        <p className="text-sm text-muted-foreground">
                          Verwalte API-Keys und Zugriffsrechte
                        </p>
                      </div>
                      <Button>Konfigurieren</Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daten & APIs</CardTitle>
                <CardDescription>
                  Verwalte Datenquellen und API-Integrationen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-6">
                    <div className="flex items-center space-x-4">
                      <Database className="h-6 w-6" />
                      <div className="flex-1">
                        <h3 className="font-medium">Datenbank-Einstellungen</h3>
                        <p className="text-sm text-muted-foreground">
                          Konfiguriere Datenbank-Verbindungen und Backups
                        </p>
                      </div>
                      <Button>Verwalten</Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System-Status</CardTitle>
              <CardDescription>
                Aktuelle Systemauslastung und Performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">CPU-Auslastung</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Speichernutzung</span>
                  <span className="text-sm font-medium">2.1 GB / 8 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">API-Anfragen / Min</span>
                  <span className="text-sm font-medium">142</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktive Integrationen</CardTitle>
              <CardDescription>
                Status der verbundenen Dienste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Google Analytics</span>
                  <Badge variant="success">Aktiv</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Meta Business</span>
                  <Badge variant="success">Aktiv</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Google Ads</span>
                  <Badge variant="warning">Wartend</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
