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
    link: ENDPOINT.ITEMS,
    icon: MdInventory,
    links: [
      { label: "Medicines", link: ENDPOINT.ITEMS },
      { label: "Batches", link: "/inventory/batches" },
      { label: "Adjustments", link: ENDPOINT.INVENTORY_ADJUST },
    ],
  },
  {
    label: "Sales",
    link: ENDPOINT.SALES.POS,
    icon: MdPointOfSale,
    links: [
      { label: "POS / Billing", link: ENDPOINT.SALES.POS },
      { label: "History", link: ENDPOINT.SALES.ORDERS },
    ],
  },
  {
    label: "Purchase",
    link: ENDPOINT.PURCHASE.BASE,
    icon: MdShoppingCart,
    links: [
      { label: "New Purchase", link: `${ENDPOINT.PURCHASE.BASE}/create` },
      { label: "History", link: ENDPOINT.PURCHASE.BASE },
    ],
  },
  {
    label: "Partners",
    link: ENDPOINT.PARTNER_VENDORS,
    icon: MdPeople,
    links: [
      { label: "Vendors", link: ENDPOINT.PARTNER_VENDORS },
      { label: "Customers", link: ENDPOINT.PARTNER_CUSTOMERS },
    ],
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
