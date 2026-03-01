import { Outlet, useLocation } from "react-router-dom";
import { AppShell, Burger, Drawer, rem, useMantineTheme } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";

import { Sidebar } from "@components/Sidebar";
import { ModalsProvider } from "@mantine/modals";
import { useEffect, useState } from "react";

const AppShellComponent = () => {
  const { width } = useViewportSize();
  const [collapseSidebar, setCollapseSidebar] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    close();
  }, [location, close]);

  useEffect(() => {
    if (width <= 768) {
      setCollapseSidebar(true);
    }
  }, [width]);

  return (
    <ModalsProvider>
      <AppShell
        navbar={{
          width:
            width <= 768
              ? 0
              : collapseSidebar
                ? theme.other.sidebarCollapseWidth
                : theme.other.sidebarWidth,
          breakpoint: 0,
        }}
        padding={rem(13)}
        h={"100%"}
        w={"100%"}
        transitionDuration={300}
      >
        {width < 768 ? (
          <Drawer
            opened={opened}
            onClose={close}
            withCloseButton={false}
            size={rem(240)}
            padding={0} // Ensure Sidebar is flush with the Drawer
          >
            <Sidebar
              isCompanyImage={false}
              companyName="ERP Inc."
              collapseSidebar={false} // Force uncollapsed view in Drawer
              setCollapseSidebar={() => {}} // No-op inside Drawer, they can just close Drawer
              wrapInNavbar={false}
            />
          </Drawer>
        ) : (
          <Sidebar
            isCompanyImage={false}
            companyName="ERP Inc."
            collapseSidebar={collapseSidebar}
            setCollapseSidebar={setCollapseSidebar}
            wrapInNavbar={true}
          />
        )}
        <AppShell.Main h={"100%"} pb={0} m={0} pt={2} mah={"100%"} mih={"100%"}>
          {!opened && (
            <Burger
              opened={opened}
              onClick={open}
              hiddenFrom="sm"
              size="sm"
              style={{
                position: "fixed",
                top: rem(6),
                right: rem(28),
                zIndex: 1000,
              }}
            />
          )}
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ModalsProvider>
  );
};

export default AppShellComponent;
