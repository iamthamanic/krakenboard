import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Integrations } from "@/pages/Integrations";
import { NotFound } from "@/pages/NotFound";
import { Privacy } from "@/pages/legal/Privacy";
import { Terms } from "@/pages/legal/Terms";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
