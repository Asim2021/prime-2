import { createBrowserRouter, Navigate } from "react-router-dom";

import { ENDPOINT, ROUTES } from "@constants/endpoints";
import AppShellComponent from "@components/Layout/AppShellComponent";
import Logout from "@pages/Auth/Logout";
import NotFound from "@pages/Common/NotFound";
import Dashboard from "@pages/Dashboard";
import ShopConfiguration from "@pages/Admin/ShopConfiguration";
import Sales from "@pages/Sales";
import Reports from "@pages/Reports";
import Inventory from "@pages/Inventory";
import Purchase from "@pages/Purchase";
import Partners from "@pages/Partners";
import Admin from "@pages/Admin";
import Users from "@pages/Admin/UserManagement";

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
      // INVENTORY
      { path: ROUTES.INVENTORY.BASE, element: <Inventory /> },
      { path: ROUTES.INVENTORY.MEDICINES, element: <Inventory /> },
      { path: ROUTES.INVENTORY.BATCHES, element: <Inventory /> },
      { path: ROUTES.INVENTORY.STOCK_ADJ, element: <Inventory /> },
      // SALES
      { path: ROUTES.SALES.BASE, element: <Sales /> },
      { path: ROUTES.SALES.HISTORY, element: <Sales /> },
      { path: ROUTES.SALES.BILLING, element: <Sales /> },
      { path: ROUTES.SALES.RETURNS, element: <Sales /> },
      // PURCHASES
      { path: ROUTES.PURCHASES.BASE, element: <Purchase /> },
      { path: ROUTES.PURCHASES.NEW, element: <Purchase /> },
      { path: ROUTES.PURCHASES.HISTORY, element: <Purchase /> },
      // PARTNERS
      { path: ROUTES.PARTNERS.BASE, element: <Partners /> },
      { path: ROUTES.PARTNERS.VENDORS, element: <Partners /> },
      { path: ROUTES.PARTNERS.CUSTOMERS, element: <Partners /> },
      // REPORTS
      { path: ROUTES.REPORTS.BASE, element: <Reports /> },
      { path: ROUTES.REPORTS.SALES, element: <Reports /> },
      { path: ROUTES.REPORTS.INVENTORY, element: <Reports /> },
      // ADMIN
      { path: ROUTES.ADMIN.BASE, element: <Admin /> },
      { path: ROUTES.ADMIN.USERS, element: <Admin /> },
      { path: ROUTES.ADMIN.SETTINGS, element: <Admin /> },
      // { path: `${ENDPOINT.SALES.ORDERS}/:id`, element: <InvoiceDetails /> },
      // { path: `${ENDPOINT.SALES.ORDERS}/:id/return`, element: <SalesReturn /> },
      // { path: ENDPOINT.INVENTORY_ITEMS, element: <Inventory /> },
      // { path: ENDPOINT.INVENTORY_ADJUST, element: <Inventory /> },
      // { path: "/inventory/batches", element: <Inventory /> },
      { path: ENDPOINT.ALL, element: <NotFound /> },
    ],
  },
]);

export default MainRouter;
