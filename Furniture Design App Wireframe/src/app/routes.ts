import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/login";
import { DesignerDashboard } from "./pages/designer-dashboard";
import { Onboarding } from "./components/onboarding";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/designer",
    Component: DesignerDashboard,
  },
]);