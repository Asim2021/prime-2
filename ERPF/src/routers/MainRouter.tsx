import Logout from "@pages/Auth/Logout";
import AppShellComponent from "@components/Layout/AppShellComponent";
import NotFound from "@pages/Common/NotFound";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ENDPOINT } from "@constants/endpoints";
import Dashboard from "@pages/Dashboard";
import ShopConfiguration from "@pages/Admin/ShopConfiguration";
import VendorList from "@pages/Partners/VendorList";
import CustomerList from "@pages/Partners/CustomerList";
import PurchaseList from "@pages/Purchase/PurchaseList";
import PurchaseEntry from "@pages/Purchase/PurchaseEntry";
import Sales from "@pages/Sales";
import InvoiceDetails from "@pages/Sales/SalesHistory/InvoiceDetails";
import SalesReturn from "@pages/Sales/SalesReturn";
import Reports from "@pages/Reports";
import RolesManagement from "@pages/Admin/RolesManagement";
import Inventory from "@pages/Inventory";
import Purchase from "@pages/Purchase";
import Partners from "@pages/Partners";
import Admin from "@pages/Admin";

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
      // { path: ENDPOINT.USERS.BASE, element: <Users /> },
      { path: ENDPOINT.ADMIN, element: <Admin /> },
      { path: ENDPOINT.SHOP, element: <ShopConfiguration /> },
      { path: ENDPOINT.ROLES, element: <RolesManagement /> },
      { path: ENDPOINT.PARTNERS, element: <Partners /> },
      { path: ENDPOINT.PARTNER_VENDORS, element: <VendorList /> },
      { path: ENDPOINT.PARTNER_CUSTOMERS, element: <CustomerList /> },
      { path: ENDPOINT.PURCHASE.BASE, element: <Purchase /> },
      { path: ENDPOINT.PURCHASE.HISTORY, element: <PurchaseList /> },
      { path: ENDPOINT.PURCHASE.CREATE, element: <PurchaseEntry /> },
      { path: ENDPOINT.SALES.BASE, element: <Sales /> },
      { path: ENDPOINT.SALES.POS, element: <Sales /> },
      { path: ENDPOINT.SALES_RETURNS, element: <Sales /> },
      { path: `${ENDPOINT.SALES.ORDERS}/:id`, element: <InvoiceDetails /> },
      { path: `${ENDPOINT.SALES.ORDERS}/:id/return`, element: <SalesReturn /> },
      { path: "/inventory", element: <Inventory /> },
      { path: ENDPOINT.INVENTORY_ITEMS, element: <Inventory /> },
      { path: ENDPOINT.INVENTORY_ADJUST, element: <Inventory /> },
      { path: "/inventory/batches", element: <Inventory /> },
      { path: "/reports", element: <Reports /> },
      { path: ENDPOINT.ALL, element: <NotFound /> },
    ],
  },
]);

export default MainRouter;
