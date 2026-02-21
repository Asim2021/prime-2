import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Stack } from "@mantine/core";
import SalesReport from "./SalesReport";
import InventoryReport from "./InventoryReport";
import { ROUTES } from "@constants/endpoints";

const Reports = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname.includes(ROUTES.REPORTS.INVENTORY))
      return "inventory";
    return "sales";
  };
  const [activeTab, setActiveTab] = useState<string | null>(getActiveTab());

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);

    if (value === "sales") navigate(ROUTES.REPORTS.SALES);
    if (value === "inventory") navigate(ROUTES.REPORTS.INVENTORY);
  };

  return (
    <Stack h="100dvh">
      <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="sales">Sales Report</Tabs.Tab>
          <Tabs.Tab value="inventory">Inventory Valuation</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="sales" pt="xs" h="calc(100dvh - 132px)">
          <SalesReport />
        </Tabs.Panel>

        <Tabs.Panel value="inventory" pt="xs" h="calc(100dvh - 16px)">
          <InventoryReport />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Reports;
