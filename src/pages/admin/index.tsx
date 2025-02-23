
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { GeneralTab } from "./components/GeneralTab";
import { SecurityTab } from "./components/SecurityTab";
import { DataTab } from "./components/DataTab";
import { FunctionsTab } from "./components/FunctionsTab";
import { DevTab } from "./components/DevTab";
import { LegalTab } from "./components/LegalTab";
import { StatusCards } from "./components/StatusCards";

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
            <TabsTrigger value="legal">Intern</TabsTrigger>
            <TabsTrigger value="functions">Function Log</TabsTrigger>
            <TabsTrigger value="dev">Dev Log</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <GeneralTab />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <DataTab />
          </TabsContent>

          <TabsContent value="legal" className="space-y-4">
            <LegalTab />
          </TabsContent>

          <TabsContent value="functions" className="space-y-4">
            <FunctionsTab />
          </TabsContent>

          <TabsContent value="dev" className="space-y-4">
            <DevTab />
          </TabsContent>
        </Tabs>

        <StatusCards />
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
