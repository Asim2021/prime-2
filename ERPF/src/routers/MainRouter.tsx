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
// import BatchList from "@pages/Inventory/BatchList";

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
      { path: ENDPOINT.PURCHASE_VENDORS, element: <VendorList /> },
      { path: ENDPOINT.SALES_CUSTOMERS, element: <CustomerList /> },
      { path: ENDPOINT.ITEMS, element: <MedicineList /> },
      // { path: ENDPOINT.BATCHES, element: <BatchList /> },
      { path: ENDPOINT.ALL, element: <NotFound /> },
    ],
  },
]);

export default MainRouter;
