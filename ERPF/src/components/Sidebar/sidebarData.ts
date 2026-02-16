import { MdHome } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { ENDPOINT } from "@constants/endpoints";

export const sidebarData = [
  { label: "Home", link: ENDPOINT.BASE, icon: MdHome },
  {
    label: "Users",
    link: ENDPOINT.USERS.BASE,
    icon: FaUsersGear,
    links: [   // Sublinks
      { label: "Item Fields", link: "#" },
      { label: "Item Groups", link: "#" },
      { label: "Others", link: "#" },
    ],
  },
];
