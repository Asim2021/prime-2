import {
  MdInventory,
  MdPointOfSale,
  MdShoppingCart,
  MdPeople,
  MdAdminPanelSettings,
  MdDashboard,
  MdBarChart,
} from "react-icons/md";
import { ROUTES } from "@constants/endpoints";
import { IconType } from "react-icons/lib";

interface SidebarDataI {
  label: string;
  link: string;
  icon: IconType;
  links?: string[] | { label: string; link: string }[];
  forRole?: "all" | string[];
  highlightFor?: string;
}

export const sidebarData: SidebarDataI[] = [
  {
    label: "Dashboard",
    link: ROUTES.HOME.BASE,
    icon: MdDashboard,
    forRole: "all",
  },
  {
    label: "Inventory",
    link: ROUTES.INVENTORY.MEDICINES,
    icon: MdInventory,
  },
  {
    label: "Sales",
    link: ROUTES.SALES.HISTORY,
    icon: MdPointOfSale,
  },
  {
    label: "Purchase",
    link: ROUTES.PURCHASES.HISTORY,
    icon: MdShoppingCart,
  },
  {
    label: "Partners",
    link: ROUTES.PARTNERS.VENDORS,
    icon: MdPeople,
  },
  {
    label: "Reports",
    link: ROUTES.REPORTS.SALES,
    icon: MdBarChart,
  },
  {
    label: "Admin",
    link: ROUTES.ADMIN.USERS,
    icon: MdAdminPanelSettings,
  },
];
