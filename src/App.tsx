
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WebsiteTrafficPage from "./pages/website/traffic";
import WebsiteFormsPage from "./pages/website/forms";
import SocialOrganicPage from "./pages/social/organic";
import SocialPaidPage from "./pages/social/paid";
import GoogleCampaignsPage from "./pages/google/campaigns";
import GoogleMetricsPage from "./pages/google/metrics";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/website/traffic" element={<WebsiteTrafficPage />} />
          <Route path="/website/forms" element={<WebsiteFormsPage />} />
          <Route path="/social/organic" element={<SocialOrganicPage />} />
          <Route path="/social/paid" element={<SocialPaidPage />} />
          <Route path="/google/campaigns" element={<GoogleCampaignsPage />} />
          <Route path="/google/metrics" element={<GoogleMetricsPage />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
