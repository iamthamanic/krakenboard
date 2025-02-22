
import { AdminLayout } from "@/components/layout/AdminLayout";

const SettingsOverview = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground mt-2">
            Der ganze Bums damit das hier ordentlich läuft
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsOverview;
