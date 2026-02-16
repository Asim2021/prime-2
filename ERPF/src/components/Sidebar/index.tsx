import companyLogo from "/assets/companyLogo.gif";
import { useState } from "react";
import {
  ActionIcon,
  AppShell,
  Divider,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { MdChevronRight, MdRocketLaunch } from "react-icons/md";

import DarkModeIconBtn from "../button/DarkModeButton/DarkModeIconBtn";
import classes from "./sidebar.module.css";
import UserSection from "./UserSection";
import { SidebarLinkGroup } from "./SidebarLinkGroup";
import { sidebarData } from "./sidebarData";
import clsx from "clsx";

interface SidebarProps {
  isCompanyImage: boolean;
  companyName?: string;
  singleOpen?: boolean | 1 | 0;
  collapseSidebar: boolean;
  setCollapseSidebar: (arg: boolean) => void;
}

/**
 * Generate the Sidebar component with dynamic links based on the sidebarData.
 * @param {boolean} isCompanyImage - Flag to determine if company image should be displayed.
 * @param {string} companyName - The name of the company.
 * @param {boolean} singleOpen - Flag to determine if only one link can be opened at a time.
 * @return {JSX.Element} The Sidebar component JSX element.
 */
export function Sidebar({
  isCompanyImage,
  companyName,
  singleOpen,
  collapseSidebar = true,
  setCollapseSidebar = () => void 0,
}: SidebarProps) {
  const [currentOpen, setCurrentOpen] = useState<string[]>([]);
  const links = sidebarData.map((item) => {
    return <SidebarLinkGroup
      {...item}
      key={item.label}
      currentOpen={currentOpen}
      setCurrentOpen={setCurrentOpen}
      singleOpen={singleOpen} // if true, only one link can be opened at a time
      collapseSidebar={collapseSidebar}

    />
  }
  );

  return (
    <AppShell.Navbar>
      <ActionIcon
        className={"!absolute -right-3 top-[50px] !rounded-full z-50"}
        aria-label={"Collapse Sidebar"}
        title={collapseSidebar ? "Expand" : "Collapse"}
        variant="filled"
        size={"sm"}
        onClick={() => setCollapseSidebar(!collapseSidebar)}
      >
        <MdChevronRight
          className={clsx(
            "transition-all duration-300",
            !collapseSidebar && "rotate-180"
          )}
        />
      </ActionIcon>
      <AppShell.Section className={classes.sidebar_header}>
        <Group
          justify={collapseSidebar ? "center" : "space-between"}
          align="center"
        >
          {isCompanyImage && !collapseSidebar ? (
            <img
              src={companyLogo}
              alt={"companyLogo"}
              height="34"
              width="100"
            />
          ) : companyName && !collapseSidebar ? (
            <Text className={classes.company_name}>{companyName}</Text>
          ) : (
            <ThemeIcon radius="md" size="lg">
              <MdRocketLaunch size="1.1rem" />
            </ThemeIcon>
          )}
          <DarkModeIconBtn />
        </Group>
      </AppShell.Section>
      <Divider />
      <AppShell.Section
        grow
        className={classes.sidebar_menu}
        component={ScrollArea}
        id="sidebar_menu_main"
        p={collapseSidebar ? 0 : 8}
      >
        <div className={classes.links}>{links}</div>
      </AppShell.Section>
      <Divider />
      <AppShell.Section className={classes.footer}>
        <UserSection collapseSidebar={collapseSidebar} />
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
