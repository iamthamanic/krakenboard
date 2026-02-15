
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
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
import AnalyticsOverview from "./pages/analytics/overview";
import AnalyticsInteractions from "./pages/analytics/interactions";
import AnalyticsFunnel from "./pages/analytics/funnel";
import AnalyticsWebsite from "./pages/analytics/website";
import AnalyticsOperations from "./pages/analytics/operations";

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
    path: "/analytics",
    element: <Navigate to="/my-board" replace />,
  },
  {
    path: "/my-board",
    element: <AnalyticsInteractions />,
  },
  {
    path: "/blocks/master",
    element: <AnalyticsOverview />,
  },
  {
    path: "/blocks/funnel",
    element: <AnalyticsFunnel />,
  },
  {
    path: "/blocks/website",
    element: <AnalyticsWebsite />,
  },
  {
    path: "/blocks/operations",
    element: <AnalyticsOperations />,
  },
  {
    path: "/analytics/overview",
    element: <Navigate to="/blocks/master" replace />,
  },
  {
    path: "/analytics/interactions",
    element: <Navigate to="/my-board" replace />,
  },
  {
    path: "/analytics/funnel",
    element: <Navigate to="/blocks/funnel" replace />,
  },
  {
    path: "/analytics/website",
    element: <Navigate to="/blocks/website" replace />,
  },
  {
    path: "/analytics/operations",
    element: <Navigate to="/blocks/operations" replace />,
  },
  {
    path: "/analytics/report-center",
    element: <Navigate to="/blocks/master" replace />,
  },
  {
    path: "/social/organic",
    element: <Navigate to="/blocks/funnel" replace />,
  },
  {
    path: "/social/paid",
    element: <Navigate to="/blocks/funnel" replace />,
  },
  {
    path: "/google/campaigns",
    element: <Navigate to="/blocks/funnel" replace />,
  },
  {
    path: "/google/metrics",
    element: <Navigate to="/blocks/funnel" replace />,
  },
  {
    path: "/website/traffic",
    element: <Navigate to="/blocks/website" replace />,
  },
  {
    path: "/website/forms",
    element: <Navigate to="/blocks/website" replace />,
  },
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
