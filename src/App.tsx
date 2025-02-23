
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Integrations from "./pages/Integrations";
import OAuthCallback from "./pages/oauth/callback";
import Admin from "./pages/Admin";
import Settings from "./pages/admin/settings";
import Users from "./pages/admin/users";

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
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
