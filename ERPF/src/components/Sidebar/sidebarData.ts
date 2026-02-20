import {
  MdInventory,
  MdPointOfSale,
  MdShoppingCart,
  MdPeople,
  MdAdminPanelSettings,
  MdDashboard,
  MdBarChart,
} from "react-icons/md";
import { ENDPOINT } from "@constants/endpoints";

export const sidebarData = [
  { label: "Dashboard", link: ENDPOINT.BASE, icon: MdDashboard },
  {
    label: "Inventory",
    link: "/inventory",
    icon: MdInventory,
  },
  {
    label: "Sales",
    link: ENDPOINT.SALES.BASE,
    icon: MdPointOfSale,
  },
  {
    label: "Purchase",
    link: ENDPOINT.PURCHASE.BASE,
    icon: MdShoppingCart,
  },
  {
    label: "Partners",
    link: ENDPOINT.PARTNERS,
    icon: MdPeople,
    // links: [
    //   { label: "Vendors", link: ENDPOINT.PARTNER_VENDORS },
    //   { label: "Customers", link: ENDPOINT.PARTNER_CUSTOMERS },
    // ],
  },
  {
    label: "Reports",
    link: ENDPOINT.REPORTS,
    icon: MdBarChart,
  },
  {
    label: "Admin",
    link: ENDPOINT.USERS.BASE,
    icon: MdAdminPanelSettings,
    links: [
      { label: "Users", link: ENDPOINT.USERS.BASE },
      { label: "Shop Settings", link: ENDPOINT.SHOP },
    ],
  },
];
