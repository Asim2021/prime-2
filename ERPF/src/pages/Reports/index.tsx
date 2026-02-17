import { Tabs, Title, Stack } from "@mantine/core";
import { useState } from "react";
import SalesReport from "./SalesReport";
import InventoryReport from "./InventoryReport";

const Reports = () => {
  const [activeTab, setActiveTab] = useState<string | null>("sales");

  return (
    <Stack p="md" h="100%">
      <Title order={3}>Business Reports</Title>

      <Tabs value={activeTab} onChange={setActiveTab} keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="sales">Sales Report</Tabs.Tab>
          <Tabs.Tab value="inventory">Inventory Valuation</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="sales" pt="xs">
          <SalesReport />
        </Tabs.Panel>

        <Tabs.Panel value="inventory" pt="xs">
          <InventoryReport />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Reports;
