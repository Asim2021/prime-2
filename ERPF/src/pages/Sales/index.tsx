import { Tabs, Paper } from "@mantine/core";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import POS from "./POS";
import SalesHistory from "./SalesHistory";
import SalesReturn from "./SalesReturn";
import { MdPointOfSale, MdHistory, MdKeyboardReturn } from "react-icons/md";
import { ENDPOINT } from "@constants/endpoints";

const Sales = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on URL
  const getActiveTab = () => {
    if (location.pathname.includes("/pos")) return "pos";
    if (location.pathname.includes("/returns")) return "returns";
    return "history";
  };

  const [activeTab, setActiveTab] = useState<string | null>(getActiveTab());

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    if (value === "pos") navigate(ENDPOINT.SALES.POS);
    else if (value === "returns") navigate(ENDPOINT.SALES_RETURNS);
    else navigate(ENDPOINT.SALES.ORDERS);
  };

  return (
    <div className="w-full h-full p-2">
      <Paper p="md" radius="md" h="100%" className="flex flex-col">
        <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
          <Tabs.List mb="md">
            <Tabs.Tab value="pos" leftSection={<MdPointOfSale size={16} />}>
              POS / Billing
            </Tabs.Tab>
            <Tabs.Tab value="history" leftSection={<MdHistory size={16} />}>
              Sales History
            </Tabs.Tab>
            <Tabs.Tab
              value="returns"
              leftSection={<MdKeyboardReturn size={16} />}
            >
              Returns
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pos" h="calc(100% - 60px)">
            <POS withHeader={false} />
          </Tabs.Panel>

          <Tabs.Panel value="history" h="calc(100% - 60px)">
            <SalesHistory withHeader={false} />
          </Tabs.Panel>

          <Tabs.Panel value="returns" h="calc(100% - 60px)">
            <SalesReturn withHeader={false} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
};

export default Sales;
