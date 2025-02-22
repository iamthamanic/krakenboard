
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import { Privacy } from "@/pages/legal/Privacy";
import { Terms } from "@/pages/legal/Terms";
import NotFound from "@/pages/NotFound";
import WebsiteTraffic from "@/pages/website/traffic";
import WebsiteForms from "@/pages/website/forms";
import SocialOrganic from "@/pages/social/organic";
import SocialPaid from "@/pages/social/paid";
import GoogleCampaigns from "@/pages/google/campaigns";
import GoogleMetrics from "@/pages/google/metrics";
import Integrations from "@/pages/Integrations";
import Settings from "@/pages/admin/Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/website/traffic" element={<WebsiteTraffic />} />
            <Route path="/website/forms" element={<WebsiteForms />} />
            <Route path="/social/organic" element={<SocialOrganic />} />
            <Route path="/social/paid" element={<SocialPaid />} />
            <Route path="/google/campaigns" element={<GoogleCampaigns />} />
            <Route path="/google/metrics" element={<GoogleMetrics />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/admin" element={<Settings />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
