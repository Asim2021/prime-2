import Logout from "@pages/Auth/Logout";
import AppShellComponent from "@pages/MantineWrapper/AppShellComponent";
import NotFound from "@pages/Common/NotFound";
import Users from "@pages/Users";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ENDPOINT } from "@constants/endpoints";
import Dashboard from "@pages/Dashboard";

const MainRouter = createBrowserRouter([
  {
    path: ENDPOINT.BASE,
    element: <AppShellComponent />,
    children: [
      { path: ENDPOINT.BASE, element: <Dashboard /> },
      {
        path: ENDPOINT.AUTH.LOGIN,
        element: <Navigate to={ENDPOINT.BASE} replace />,
      },
      { path: ENDPOINT.AUTH.LOGOUT, element: <Logout /> },
      { path: ENDPOINT.USERS.BASE, element: <Users /> },
      { path: ENDPOINT.ALL, element: <NotFound /> },
    ],
  },
]);

export default MainRouter;
