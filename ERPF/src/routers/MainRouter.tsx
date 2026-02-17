import Logout from "@pages/Auth/Logout";
import AppShellComponent from "@components/Layout/AppShellComponent";
import NotFound from "@pages/Common/NotFound";
import Users from "@pages/Admin/UserManagement";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ENDPOINT } from "@constants/endpoints";
import Dashboard from "@pages/Dashboard";
import ShopConfiguration from "@pages/Admin/ShopConfiguration";
import VendorList from "@pages/Partners/VendorList";
import CustomerList from "@pages/Partners/CustomerList";
import MedicineList from "@pages/Inventory/MedicineList";
import PurchaseList from "@pages/Inventory/PurchaseList";
import PurchaseEntry from "@pages/Inventory/PurchaseEntry";
import POS from "@pages/Sales/POS";
import SalesHistory from "@pages/Sales/SalesHistory";
import InvoiceDetails from "@pages/Sales/SalesHistory/InvoiceDetails";
import SalesReturn from "@pages/Sales/SalesReturn";
import StockAdjustment from "@pages/Inventory/StockAdjustment";
import Reports from "@pages/Reports";
import BatchList from "@pages/Inventory/BatchList";
import RolesManagement from "@pages/Admin/RolesManagement";

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
      { path: ENDPOINT.SHOP, element: <ShopConfiguration /> },
      { path: "/roles", element: <RolesManagement /> },
      { path: ENDPOINT.PARTNER_VENDORS, element: <VendorList /> },
      { path: ENDPOINT.PARTNER_CUSTOMERS, element: <CustomerList /> },
      { path: ENDPOINT.PURCHASE.BASE, element: <PurchaseList /> },
      { path: `${ENDPOINT.PURCHASE.BASE}/create`, element: <PurchaseEntry /> },
      { path: ENDPOINT.SALES.POS, element: <POS /> },
      { path: ENDPOINT.SALES.ORDERS, element: <SalesHistory /> },
      { path: `${ENDPOINT.SALES.ORDERS}/:id`, element: <InvoiceDetails /> },
      { path: `${ENDPOINT.SALES.ORDERS}/:id/return`, element: <SalesReturn /> },
      { path: ENDPOINT.INVENTORY_ITEMS, element: <MedicineList /> },
      { path: ENDPOINT.INVENTORY_ADJUST, element: <StockAdjustment /> },
      { path: "/inventory/batches", element: <BatchList /> },
      { path: "/reports", element: <Reports /> },
      { path: ENDPOINT.ALL, element: <NotFound /> },
    ],
  },
]);

export default MainRouter;
