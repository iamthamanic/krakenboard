
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Integrations from "./pages/Integrations";
import OAuthCallback from "./pages/oauth/callback";
import Admin from "./pages/Admin";
import Settings from "./pages/admin/settings";
import Users from "./pages/admin/users";
import Security from "./pages/admin/security";
import AdminPage from "./pages/admin/index";
import SocialOrganic from "./pages/social/organic";
import SocialPaid from "./pages/social/paid";
import GoogleCampaigns from "./pages/google/campaigns";
import GoogleMetrics from "./pages/google/metrics";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/integrations",
    element: <Integrations />,
  },
  {
    path: "/oauth/callback",
    element: <OAuthCallback />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/settings",
    element: <Settings />,
  },
  {
    path: "/admin/users",
    element: <Users />,
  },
  {
    path: "/admin/security",
    element: <Security />,
  },
  {
    path: "/admin/integrations",
    element: <Integrations />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminPage />,
  },
  {
    path: "/social/organic",
    element: <SocialOrganic />,
  },
  {
    path: "/social/paid",
    element: <SocialPaid />,
  },
  {
    path: "/google/campaigns",
    element: <GoogleCampaigns />,
  },
  {
    path: "/google/metrics",
    element: <GoogleMetrics />,
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 Minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
