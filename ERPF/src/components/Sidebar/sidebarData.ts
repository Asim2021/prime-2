import {
  MdHome,
  MdInventory,
  MdPointOfSale,
  MdShoppingCart,
  MdPeople,
  MdAdminPanelSettings,
  MdSettings,
  MdDashboard,
  MdBarChart,
} from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { ENDPOINT } from "@constants/endpoints";

export const sidebarData = [
  { label: "Dashboard", link: ENDPOINT.BASE, icon: MdDashboard },
  {
    label: "Inventory",
    link: "#",
    icon: MdInventory,
    links: [
      { label: "Medicines", link: ENDPOINT.ITEMS },
      { label: "Batches", link: "#" }, // To be implemented
      { label: "Adjustments", link: ENDPOINT.INVENTORY_ADJUST },
    ],
  },
  {
    label: "Sales",
    link: "#",
    icon: MdPointOfSale,
    links: [
      { label: "POS", link: "#" }, // To be implemented
      { label: "History", link: ENDPOINT.SALES_INVOICES },
    ],
  },
  {
    label: "Purchase",
    link: "#",
    icon: MdShoppingCart,
    links: [
      { label: "New Purchase", link: ENDPOINT.PURCHASE_GRN },
      { label: "History", link: ENDPOINT.PURCHASE_ORDERS },
    ],
  },
  {
    label: "Partners",
    link: "#",
    icon: MdPeople,
    links: [
      { label: "Vendors", link: ENDPOINT.PURCHASE_VENDORS }, // Or dedicated vendors route
      { label: "Customers", link: ENDPOINT.SALES_CUSTOMERS },
    ],
  },
  {
    label: "Reports",
    link: "#",
    icon: MdBarChart,
    links: [
      { label: "Sales Report", link: "#" },
      { label: "Inventory Report", link: "#" },
    ],
  },
  {
    label: "Admin",
    link: "#",
    icon: MdAdminPanelSettings,
    links: [
      { label: "Users", link: ENDPOINT.USERS.BASE },
      { label: "Shop Settings", link: ENDPOINT.SHOP },
      { label: "Roles", link: ENDPOINT.ROLES },
    ],
  },
];
