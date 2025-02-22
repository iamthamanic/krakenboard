
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Globe, Database, Bell, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground mt-2">
            Verwalte die Systemkonfiguration und Integrationen
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Änderungen an den Systemeinstellungen können die Performance beeinflussen.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="scanning">Scanning</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Allgemeine Einstellungen</CardTitle>
                <CardDescription>
                  Grundlegende Konfiguration des Systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Debug-Modus</h3>
                      <p className="text-sm text-muted-foreground">
                        Aktiviert erweiterte Logging-Funktionen
                      </p>
                    </div>
                    <Button variant="outline">Aktivieren</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Cache Leeren</h3>
                      <p className="text-sm text-muted-foreground">
                        Setzt den System-Cache zurück
                      </p>
                    </div>
                    <Button variant="outline">Cache leeren</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scanning-Einstellungen</CardTitle>
                <CardDescription>
                  Konfiguration der Website-Scanning-Funktionen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Scan-Intervall</h3>
                      <p className="text-sm text-muted-foreground">
                        Legt fest, wie oft Websites gescannt werden
                      </p>
                    </div>
                    <Button variant="outline">Konfigurieren</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Crawling-Tiefe</h3>
                      <p className="text-sm text-muted-foreground">
                        Maximale Tiefe beim Website-Scanning
                      </p>
                    </div>
                    <Button variant="outline">Anpassen</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungs-Einstellungen</CardTitle>
                <CardDescription>
                  Konfiguriere System- und Alert-Benachrichtigungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">E-Mail Benachrichtigungen</h3>
                      <p className="text-sm text-muted-foreground">
                        Verwalte E-Mail Alert-Einstellungen
                      </p>
                    </div>
                    <Badge variant="success">Aktiviert</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Slack Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Benachrichtigungen via Slack
                      </p>
                    </div>
                    <Badge variant="warning">Nicht konfiguriert</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Aktuelle Systemkonfiguration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Version</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Umgebung</span>
                  <span className="text-sm font-medium">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Letztes Update</span>
                  <span className="text-sm font-medium">Vor 2 Tagen</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Status</CardTitle>
              <CardDescription>
                Status der System-APIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Web Scanner API</span>
                  <Badge variant="success">Aktiv</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Analytics API</span>
                  <Badge variant="success">Aktiv</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Integration API</span>
                  <Badge variant="warning">Wartung</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
