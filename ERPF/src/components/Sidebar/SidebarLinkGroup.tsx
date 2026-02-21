import clsx from "clsx";
import { useState } from "react";
import { MdExpandLess, MdExpandCircleDown } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

import {
  Box,
  Collapse,
  Flex,
  Group,
  Menu,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";

import classes from "./sidebar.module.css";
import { IconType } from "react-icons/lib";

interface LinksGroupProps {
  icon: IconType;
  key?: string;
  label: string;
  link: string;
  currentOpen: string[];
  setCurrentOpen: React.Dispatch<React.SetStateAction<string[]>>;
  links?: { label: string; link: string }[] | undefined;
  singleOpen?: boolean | 1 | 0;
  collapseSidebar?: boolean;
  forRole?: "all" | string[];
  highlightFor?: string;
}

export const SidebarLinkGroup = ({
  icon: Icon,
  label,
  link,
  links,
  currentOpen,
  setCurrentOpen,
  singleOpen = false,
  collapseSidebar = false,
}: LinksGroupProps) => {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(false);
  const { pathname } = useLocation();
  const subLinkActive =
    hasLinks && links.some((link) => pathname === link.link);

  const items = (hasLinks ? links : []).map((link) => (
    <Link to={link.link} key={link.label}>
      <Text
        className={clsx(
          classes.sublink,
          pathname === link.link && classes.active,
        )}
        id="sublink_text"
        component="strong"
      >
        {link.label}
      </Text>
    </Link>
  ));

  const menuItems = (hasLinks ? links : []).map((link) => (
    <Link to={link.link} key={link.label}>
      <Menu.Item
        className={clsx(
          classes.sub_menu_option,
          pathname === link.link && " highlight_bg",
        )}
        title={"Go to " + link.label}
      >
        <Text
          className={clsx(
            "sublink_text",
            pathname === link.link && classes.active,
          )}
          id="sublink_text"
          size="sm"
        >
          {link.label}
        </Text>
      </Menu.Item>
    </Link>
  ));

  const isAllCollapsible = singleOpen ? label === currentOpen[0] : opened;

  const onClickHandler = () => {
    setOpened((o) => !o);
    if (singleOpen) {
      if (currentOpen[0] !== label) {
        setCurrentOpen([label]);
      } else {
        setCurrentOpen([]);
      }
    } else if (!currentOpen.includes(label)) {
      setCurrentOpen([...currentOpen, label]);
    } else {
      setCurrentOpen(currentOpen.filter((e) => e !== label));
    }
  };

  return (
    <Flex direction={"column"} gap={8} justify={"center"} mb={4}>
      <Flex
        className={clsx(
          collapseSidebar ? classes.control_mobile : classes.control,
          isAllCollapsible && "active",
        )}
      >
        <section id="main-menu">
          <Group
            display={"flex"}
            justify={collapseSidebar ? "center" : "space-between"}
            pe={collapseSidebar ? 0 : 4}
            id="main_menu_group"
            className={clsx(
              "overflow-x-hidden",
              (pathname.includes(label.toLowerCase()) || subLinkActive) &&
                !collapseSidebar &&
                classes.main_menu_active,
            )}
            pos={"relative"}
          >
            <Box
              style={{ alignItems: "center" }}
              display={"flex"}
              flex={collapseSidebar ? 0 : 1}
              component={Link}
              to={link}
              id="link_box"
              className={clsx(collapseSidebar && classes.link_box)}
            >
              <Tooltip label={label}>
                <ThemeIcon
                  variant={
                    (pathname.includes(label.toLowerCase()) || subLinkActive) &&
                    collapseSidebar
                      ? "outline"
                      : "transparent"
                  }
                  size="lg"
                  className={clsx(
                    (pathname.includes(label.toLowerCase()) || subLinkActive) &&
                      collapseSidebar &&
                      classes.main_icon,
                  )}
                >
                  <Icon size="1.25rem" />
                </ThemeIcon>
              </Tooltip>
              {!collapseSidebar && (
                <Box ml="xs">
                  <Text
                    className={clsx(
                      classes.link_main,
                      (pathname === link || subLinkActive) && classes.active,
                    )}
                  >
                    {label}
                  </Text>
                </Box>
              )}
            </Box>
            {collapseSidebar && hasLinks && (
              <Menu
                id="user_section_main"
                position="right-end"
                withArrow
                arrowPosition="center"
              >
                <Menu.Target>
                  <ThemeIcon
                    variant="transparent"
                    pos={"absolute"}
                    right={-5}
                    className={clsx(
                      "cursor-pointer hover:scale-105 z-10",
                      subLinkActive && "text-primary-600",
                      collapseSidebar && classes.link_box,
                    )}
                    title="Open Menu"
                  >
                    <MdExpandCircleDown size={18} className="-rotate-90" />
                  </ThemeIcon>
                </Menu.Target>
                <Menu.Dropdown className="shadow-lg!" id="sub_menu_dd">
                  {menuItems}
                </Menu.Dropdown>
              </Menu>
            )}
            {hasLinks && !collapseSidebar && (
              <UnstyledButton
                aria-label="Expand More"
                className={clsx(
                  classes.expand_btn,
                  currentOpen.includes(label) && classes.icon_active,
                )}
                onClick={onClickHandler}
              >
                <MdExpandLess
                  size="20px"
                  className={clsx(
                    classes.chevron,
                    isAllCollapsible && classes.chevron_rotate,
                  )}
                />
              </UnstyledButton>
            )}
          </Group>
        </section>
      </Flex>
      {!collapseSidebar && (
        <section id="sub-menu">
          {hasLinks ? <Collapse in={isAllCollapsible}>{items}</Collapse> : null}
        </section>
      )}
    </Flex>
  );
};
