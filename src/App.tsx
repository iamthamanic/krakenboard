
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
]);

// Erstelle eine neue QueryClient-Instanz
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
