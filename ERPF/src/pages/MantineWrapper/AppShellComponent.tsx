import { Outlet } from "react-router-dom";
import { AppShell, rem, useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

import { Sidebar } from "../../components/Sidebar";
import { ModalsProvider } from "@mantine/modals";
import { useEffect, useState } from "react";
// import { useState } from "react";

const AppShellComponent = () => {
  const { width } = useViewportSize();
  const [collapseSidebar, setCollapseSidebar] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (width <= 820) {
      setCollapseSidebar(true);
    }
  }, [width]);

  return (
    <ModalsProvider>
      <AppShell
        navbar={{
          width: collapseSidebar
            ? theme.other.sidebarCollapseWidth
            : theme.other.sidebarWidth,
          breakpoint: 0,
        }}
        padding={rem(14)}
        h={"100%"}
        w={"100%"}
        transitionDuration={300}
      >
        <Sidebar
          isCompanyImage={false}
          companyName="ERP Inc."
          collapseSidebar={collapseSidebar}
          setCollapseSidebar={setCollapseSidebar}
        />
        <AppShell.Main h={"100%"} pt={0} pb={0} m={0} mah={"100%"} mih={"100%"}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ModalsProvider>
  );
};

export default AppShellComponent;
